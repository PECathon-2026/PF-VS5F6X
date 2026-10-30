import { Router, Request, Response } from 'express';
import { canonicalizeUrl } from '../canonicalUrl';
import { safeFetch, FEED_ALLOWED_CONTENT_TYPES } from '../safeFetch';

const router = Router();

/**
 * GET /api/fetch?url=...
 *
 * Safely fetches an upstream webpage or RSS/Atom feed for client-side parsing.
 * Returns response in an inert JSON payload to prevent executable HTML same-origin execution.
 *
 * Query params:
 *   url: string (required)
 *
 * Success 200 OK:
 *   {
 *     "url": "https://example.com/feed.xml",
 *     "contentType": "application/rss+xml; charset=utf-8",
 *     "content": "<rss>...</rss>"
 *   }
 */
router.get('/fetch', async (req: Request, res: Response): Promise<void> => {
  const rawUrl = req.query.url;

  // 1. Input validation & canonicalization
  const canonicalResult = canonicalizeUrl(rawUrl);
  if (!canonicalResult.valid) {
    const httpStatus =
      canonicalResult.code === 'VALIDATION_ERROR' ? 422
      : canonicalResult.code === 'URL_NOT_ALLOWED' ? 403
      : 400;

    res.status(httpStatus).json({
      error: {
        code: canonicalResult.code,
        message: canonicalResult.message,
      },
    });
    return;
  }

  // 2. Safe fetch with feed-specific allowed content types (RSS, Atom, XML, HTML)
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(canonicalResult.canonicalUrl);
  } catch {
    res.status(400).json({
      error: {
        code: 'INVALID_URL',
        message: 'Enter a valid public webpage URL.',
      },
    });
    return;
  }

  const fetchResult = await safeFetch(parsedUrl, {
    allowedContentTypes: FEED_ALLOWED_CONTENT_TYPES,
    acceptHeader: 'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html, application/xhtml+xml',
  });

  if (!fetchResult.ok) {
    const httpStatus =
      fetchResult.code === 'URL_NOT_ALLOWED' ? 403
      : fetchResult.code === 'FETCH_TIMEOUT' ? 504
      : fetchResult.code === 'PAGE_FETCH_FAILED' ? 502
      : 500;

    res.status(httpStatus).json({
      error: {
        code: fetchResult.code,
        message: fetchResult.message,
      },
    });
    return;
  }

  // 3. Security headers: prevent browser MIME-type sniffing or framing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'none'");

  // 4. Return inert JSON response
  res.status(200).json({
    url: fetchResult.finalUrl,
    contentType: fetchResult.contentType,
    content: fetchResult.body,
  });
});

export default router;
