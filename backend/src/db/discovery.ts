import { Pool, PoolClient } from 'pg';
import { getDatabasePool } from './pool';
import { canonicalizeUrl } from '../canonicalUrl';

export interface CanonicalFeedRow {
  id: string; // BIGINT as string in pg
  canonical_url: string;
  host: string;
  title: string | null;
  is_seed: boolean;
  eligible_at: Date | null;
  created_at: Date;
}

export interface RecommendedFeed {
  canonicalUrl: string;
  host: string;
  title: string | null;
  reason: string;
  supportCount: number;
}

export interface PopularFeed {
  canonicalUrl: string;
  host: string;
  title: string | null;
  aggregateCount: number;
  isSeed: boolean;
}

/**
 * Ensures a list of canonical URLs exist in `canonical_feeds`.
 * Returns a map of canonical_url -> feed id.
 */
export async function getOrCreateFeedIds(
  client: PoolClient,
  urls: { canonicalUrl: string; host: string }[],
): Promise<Map<string, string>> {
  const feedMap = new Map<string, string>();
  if (urls.length === 0) return feedMap;

  for (const item of urls) {
    const res = await client.query(
      `
      INSERT INTO canonical_feeds (canonical_url, host)
      VALUES ($1, $2)
      ON CONFLICT (canonical_url) DO UPDATE
      SET canonical_url = EXCLUDED.canonical_url
      RETURNING id, canonical_url;
      `,
      [item.canonicalUrl, item.host],
    );
    if (res.rows[0]) {
      feedMap.set(res.rows[0].canonical_url, res.rows[0].id.toString());
    }
  }

  return feedMap;
}

/**
 * Ingests a user-consented batch of feeds into aggregate counters.
 * - Does not store raw contribution batches or user identifiers.
 * - Updates feed_popularity for each feed.
 * - Updates feed_pairs for each unique unordered pair (feed_a < feed_b).
 */
export async function recordFeedContribution(
  urls: { canonicalUrl: string; host: string }[],
  customPool?: Pool,
): Promise<{ success: boolean; pairsUpdated: number; feedsUpdated: number }> {
  if (urls.length < 2) {
    return { success: true, pairsUpdated: 0, feedsUpdated: urls.length };
  }

  const pool = customPool || getDatabasePool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Ensure all feeds exist in canonical_feeds
    const feedMap = await getOrCreateFeedIds(client, urls);
    const feedIds = Array.from(feedMap.values())
      .map((id) => BigInt(id))
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    // Deduplicate IDs
    const uniqueFeedIds = Array.from(new Set(feedIds));

    // 2. Increment feed_popularity
    for (const feedId of uniqueFeedIds) {
      await client.query(
        `
        INSERT INTO feed_popularity (feed_id, aggregate_count, updated_at)
        VALUES ($1, 1, NOW())
        ON CONFLICT (feed_id) DO UPDATE
        SET aggregate_count = feed_popularity.aggregate_count + 1,
            updated_at = NOW();
        `,
        [feedId.toString()],
      );
    }

    // 3. Increment feed_pairs for all unique unordered pairs
    let pairsUpdated = 0;
    for (let i = 0; i < uniqueFeedIds.length; i++) {
      for (let j = i + 1; j < uniqueFeedIds.length; j++) {
        const feedA = uniqueFeedIds[i].toString();
        const feedB = uniqueFeedIds[j].toString();

        await client.query(
          `
          INSERT INTO feed_pairs (feed_a_id, feed_b_id, contribution_count, updated_at)
          VALUES ($1, $2, 1, NOW())
          ON CONFLICT (feed_a_id, feed_b_id) DO UPDATE
          SET contribution_count = feed_pairs.contribution_count + 1,
              updated_at = NOW();
          `,
          [feedA, feedB],
        );
        pairsUpdated++;
      }
    }

    await client.query('COMMIT');
    return { success: true, pairsUpdated, feedsUpdated: uniqueFeedIds.length };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Returns feed recommendations based on co-occurrence in feed_pairs.
 * - Excludes feeds already in input list.
 * - Applies minimum support k=3 threshold for pair-based evidence.
 * - Uses generic seed-directory recommendation when support is below threshold.
 */
export async function queryFeedRecommendations(
  inputUrls: string[],
  limit: number = 20,
  customPool?: Pool,
): Promise<RecommendedFeed[]> {
  const pool = customPool || getDatabasePool();

  // Find IDs of input feeds
  const lookupRes = await pool.query(
    'SELECT id, canonical_url FROM canonical_feeds WHERE canonical_url = ANY($1)',
    [inputUrls],
  );

  const inputIdStrings = lookupRes.rows.map((r) => r.id.toString());
  const inputUrlsSet = new Set(inputUrls);

  // If no input feeds are in our directory, fall back to popular feeds
  if (inputIdStrings.length === 0) {
    const popularRes = await pool.query(
      `
      SELECT c.canonical_url, c.host, c.title, COALESCE(p.aggregate_count, 0) as agg_count
      FROM canonical_feeds c
      LEFT JOIN feed_popularity p ON c.id = p.feed_id
      WHERE (c.is_seed = true OR c.eligible_at <= NOW())
        AND NOT (c.canonical_url = ANY($1))
      ORDER BY agg_count DESC, c.created_at DESC
      LIMIT $2;
      `,
      [inputUrls, limit],
    );

    return popularRes.rows.map((r) => ({
      canonicalUrl: r.canonical_url,
      host: r.host,
      title: r.title,
      reason: 'Curated independent blog from seed directory',
      supportCount: parseInt(r.agg_count || '0', 10),
    }));
  }

  // Find co-occurring feeds:
  // WHERE (feed_a_id IN input AND feed_b_id NOT IN input) OR (feed_b_id IN input AND feed_a_id NOT IN input)
  const coOccurQuery = `
    WITH candidate_pairs AS (
      SELECT
        CASE WHEN fp.feed_a_id = ANY($1::bigint[]) THEN fp.feed_b_id ELSE fp.feed_a_id END AS candidate_id,
        fp.contribution_count
      FROM feed_pairs fp
      WHERE (fp.feed_a_id = ANY($1::bigint[]) AND NOT (fp.feed_b_id = ANY($1::bigint[])))
         OR (fp.feed_b_id = ANY($1::bigint[]) AND NOT (fp.feed_a_id = ANY($1::bigint[])))
    ),
    aggregated_candidates AS (
      SELECT
        cp.candidate_id,
        SUM(cp.contribution_count) AS total_support,
        MAX(cp.contribution_count) AS max_single_support
      FROM candidate_pairs cp
      GROUP BY cp.candidate_id
    )
    SELECT
      c.canonical_url,
      c.host,
      c.title,
      ac.total_support,
      ac.max_single_support
    FROM aggregated_candidates ac
    JOIN canonical_feeds c ON c.id = ac.candidate_id
    WHERE (c.is_seed = true OR c.eligible_at IS NULL OR c.eligible_at <= NOW())
      AND NOT (c.canonical_url = ANY($2))
    ORDER BY ac.total_support DESC
    LIMIT $3;
  `;

  const candidatesRes = await pool.query(coOccurQuery, [inputIdStrings, inputUrls, limit]);

  const results: RecommendedFeed[] = [];
  const candidateUrls = new Set<string>();

  for (const row of candidatesRes.rows) {
    candidateUrls.add(row.canonical_url);
    const maxSingleSupport = parseInt(row.max_single_support || '0', 10);
    const totalSupport = parseInt(row.total_support || '0', 10);

    // Minimum support k=3 threshold
    let reason = 'Frequently followed together with blogs in your feed list';
    if (maxSingleSupport < 3) {
      reason = 'Emerging blog recommendation';
    }

    results.push({
      canonicalUrl: row.canonical_url,
      host: row.host,
      title: row.title,
      reason,
      supportCount: totalSupport,
    });
  }

  // If fewer than limit, fill remaining slots with popular seeds
  if (results.length < limit) {
    const needed = limit - results.length;
    const excludeUrls = Array.from(new Set([...inputUrls, ...candidateUrls]));

    const fillerRes = await pool.query(
      `
      SELECT c.canonical_url, c.host, c.title, COALESCE(p.aggregate_count, 0) as agg_count
      FROM canonical_feeds c
      LEFT JOIN feed_popularity p ON c.id = p.feed_id
      WHERE (c.is_seed = true OR c.eligible_at <= NOW())
        AND NOT (c.canonical_url = ANY($1))
      ORDER BY agg_count DESC, c.created_at DESC
      LIMIT $2;
      `,
      [excludeUrls, needed],
    );

    for (const r of fillerRes.rows) {
      results.push({
        canonicalUrl: r.canonical_url,
        host: r.host,
        title: r.title,
        reason: 'Curated independent blog from seed directory',
        supportCount: parseInt(r.agg_count || '0', 10),
      });
    }
  }

  return results;
}

/**
 * Returns popular feeds based on feed_popularity and seed status.
 * Works without user contribution opt-in.
 */
export async function getPopularFeeds(
  limit: number = 20,
  offset: number = 0,
  customPool?: Pool,
): Promise<{ feeds: PopularFeed[]; total: number }> {
  const pool = customPool || getDatabasePool();

  const countRes = await pool.query(`
    SELECT COUNT(*) as total
    FROM canonical_feeds c
    WHERE c.is_seed = true OR c.eligible_at <= NOW();
  `);
  const total = parseInt(countRes.rows[0]?.total || '0', 10);

  const query = `
    SELECT
      c.canonical_url,
      c.host,
      c.title,
      c.is_seed,
      COALESCE(p.aggregate_count, 0) AS agg_count
    FROM canonical_feeds c
    LEFT JOIN feed_popularity p ON c.id = p.feed_id
    WHERE c.is_seed = true OR c.eligible_at <= NOW()
    ORDER BY agg_count DESC, c.created_at DESC
    LIMIT $1 OFFSET $2;
  `;

  const feedsRes = await pool.query(query, [limit, offset]);

  const feeds: PopularFeed[] = feedsRes.rows.map((r) => ({
    canonicalUrl: r.canonical_url,
    host: r.host,
    title: r.title,
    aggregateCount: parseInt(r.agg_count || '0', 10),
    isSeed: Boolean(r.is_seed),
  }));

  return { feeds, total };
}
