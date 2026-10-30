/**
 * Reading time and word count calculation.
 */

export function calculateReadingTime(textOrHtml: string): {
  wordCount: number;
  readingTimeMinutes: number;
} {
  // Strip HTML tags for word counting
  const plainText = textOrHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!plainText) {
    return { wordCount: 0, readingTimeMinutes: 1 };
  }

  // Match actual word tokens (alphanumeric and hyphens/apostrophes)
  const words = plainText.match(/[\w'-]+/g) || [];
  const wordCount = words.length;
  // Standard reading speed: ~200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    readingTimeMinutes,
  };
}
