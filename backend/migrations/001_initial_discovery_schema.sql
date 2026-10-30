-- Migration 001_initial_discovery_schema.sql
-- SmallWebReader discovery and privacy-preserving counters schema

-- 1. canonical_feeds
-- Stores canonical feed URLs and limited public metadata.
CREATE TABLE IF NOT EXISTS canonical_feeds (
    id BIGSERIAL PRIMARY KEY,
    canonical_url TEXT NOT NULL UNIQUE,
    host TEXT NOT NULL,
    title TEXT,
    is_seed BOOLEAN NOT NULL DEFAULT FALSE,
    eligible_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_canonical_url_nonempty CHECK (length(trim(canonical_url)) > 0),
    CONSTRAINT chk_host_nonempty CHECK (length(trim(host)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_canonical_feeds_host ON canonical_feeds(host);
CREATE INDEX IF NOT EXISTS idx_canonical_feeds_is_seed ON canonical_feeds(is_seed);
CREATE INDEX IF NOT EXISTS idx_canonical_feeds_eligible_at ON canonical_feeds(eligible_at);

-- 2. feed_pairs
-- Stores aggregate co-subscription counts between unordered feed pairs.
-- Enforces feed_a_id < feed_b_id to prevent duplicates or reversed ordering.
CREATE TABLE IF NOT EXISTS feed_pairs (
    feed_a_id BIGINT NOT NULL REFERENCES canonical_feeds(id) ON DELETE CASCADE,
    feed_b_id BIGINT NOT NULL REFERENCES canonical_feeds(id) ON DELETE CASCADE,
    contribution_count INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (feed_a_id, feed_b_id),
    CONSTRAINT chk_feed_order CHECK (feed_a_id < feed_b_id),
    CONSTRAINT chk_contribution_count_nonnegative CHECK (contribution_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_feed_pairs_feed_b ON feed_pairs(feed_b_id);
CREATE INDEX IF NOT EXISTS idx_feed_pairs_count ON feed_pairs(contribution_count DESC);

-- 3. feed_popularity
-- Stores aggregate contribution-event counts per feed.
CREATE TABLE IF NOT EXISTS feed_popularity (
    feed_id BIGINT PRIMARY KEY REFERENCES canonical_feeds(id) ON DELETE CASCADE,
    aggregate_count INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_aggregate_count_nonnegative CHECK (aggregate_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_feed_popularity_count ON feed_popularity(aggregate_count DESC);

-- 4. rate_limits
-- Stores ephemeral HMAC-derived client IP hashes and request counters.
-- Records expire within 24 hours. No raw IPs are stored.
CREATE TABLE IF NOT EXISTS rate_limits (
    ip_hash CHAR(64) NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    expires_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (ip_hash, window_start),
    CONSTRAINT chk_rate_limits_count_positive CHECK (count > 0),
    CONSTRAINT chk_rate_limits_expiry CHECK (expires_at >= window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits(expires_at);
