/**
 * Minimal content extractor.
 * Pulls a plain-text title and body text out of raw HTML
 * without executing scripts or trusting the page.
 *
 * Strategy:
 *  1. Extract <title> text.
 *  2. Strip <script>, <style>, <noscript>, <head>, comments.
 *  3. Collapse whitespace for a readable plain-text result.
 *
 * Deliberately avoids returning raw HTML to the frontend
 * to prevent same-origin XSS if the client renders it directly.
 */

export interface ExtractedContent {
  title: string | null;
  content: string;
}

export function extractContent(html: string): ExtractedContent {
  // 1. Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeHtmlEntities(titleMatch[1].replace(/<[^>]+>/g, '').trim()) : null;

  // 2. Remove unwanted blocks (with word boundaries to prevent <head matching <header, etc.)
  let text = html
    .replace(/<!--[\s\S]*?(-->|$)/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?(<\/script>|$)/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?(<\/style>|$)/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?(<\/noscript>|$)/gi, '')
    .replace(/<head\b[^>]*>[\s\S]*?(<\/head>|(?=<body\b)|$)/gi, '');

  // 3. Replace block-level tags with newlines for readability
  text = text
    .replace(/<\/?(p|div|article|section|header|footer|main|nav|aside|h[1-6]|li|dt|dd|br|tr|blockquote|pre)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')                          // strip remaining tags
    .replace(/&nbsp;/gi, ' ');

  // 4. Decode common and numeric entities and collapse whitespace
  text = decodeHtmlEntities(text)
    .replace(/\r\n|\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { title, content: text };
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return !isNaN(code) && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    })
    .replace(/&#([0-9]+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return !isNaN(code) && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    });
}
