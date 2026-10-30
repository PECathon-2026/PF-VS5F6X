import { describe, it, expect } from 'vitest';
import { MockApiClient } from '../services/mockClient';
import { calculateReadingTime } from '../utils/readingTime';

describe('Reading Time Calculator', () => {
  it('calculates reading time and word count correctly', () => {
    const text = 'This is a sample sentence with six words.';
    const result = calculateReadingTime(text);
    expect(result.wordCount).toBe(8);
    expect(result.readingTimeMinutes).toBe(1);
  });

  it('strips HTML tags before counting words', () => {
    const html = '<p>First paragraph with <strong>bold text</strong>.</p><p>Second paragraph.</p>';
    const result = calculateReadingTime(html);
    expect(result.wordCount).toBe(7);
  });
});

describe('MockApiClient', () => {
  const client = new MockApiClient();

  it('retrieves bundled sample fixture', async () => {
    const result = await client.extractArticle('https://editorial.smallweb.example/zen-reading');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('The Architecture of Distraction-Free Spaces');
      expect(result.data.content).toContain('The Geometry of Attention');
      expect(result.data.readingTimeMinutes).toBeGreaterThan(0);
    }
  });

  it('dynamically generates structured fixture for unknown URLs in fixture mode', async () => {
    const result = await client.extractArticle('https://custom-site.org/my-essay');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.url).toBe('https://custom-site.org/my-essay');
      expect(result.data.siteName).toBe('custom-site.org');
      expect(result.data.content).toContain('SmallWebReader development fixture');
    }
  });

  it('handles health check successfully', async () => {
    const health = await client.checkHealth();
    expect(health.status).toBe('ok');
  });
});
