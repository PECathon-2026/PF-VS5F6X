import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReaderCanvas } from '../components/reader/ReaderCanvas';
import { Article } from '../types/article';

describe('ReaderCanvas Sanitization & Rendering', () => {
  const sampleArticle: Article = {
    url: 'https://example.com/clean-read',
    title: 'Clean Distraction-Free Article',
    byline: 'Jane Doe',
    publishedDate: '2026-10-30T00:00:00Z',
    siteName: 'Example News',
    excerpt: 'An excerpt describing the article.',
    readingTimeMinutes: 3,
    wordCount: 450,
    content: `
      <p>Legitimate article paragraph.</p>
      <script>window.__malicious_injected_code = true;</script>
      <img src="https://example.com/valid.jpg" alt="Valid illustration" onerror="alert('xss')" />
      <blockquote>Important quotation.</blockquote>
    `,
  };

  it('renders article title, byline, and site name', () => {
    render(<ReaderCanvas article={sampleArticle} />);
    expect(screen.getByText('Clean Distraction-Free Article')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Example News')).toBeInTheDocument();
  });

  it('sanitizes malicious script tags and inline event handlers', () => {
    const { container } = render(<ReaderCanvas article={sampleArticle} />);
    // Script tag should be completely removed
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);

    // img onerror attribute should be stripped
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('onerror')).toBeNull();
  });

  it('handles empty content gracefully with fallback notice', () => {
    const emptyArticle: Article = {
      url: 'https://example.com/empty',
      title: 'Empty Article',
      content: '',
    };
    render(<ReaderCanvas article={emptyArticle} />);
    expect(screen.getByText(/No textual content could be extracted/i)).toBeInTheDocument();
  });

  it('formats plain-text extracted content with multiple paragraphs into readable paragraph elements', () => {
    const plainTextArticle: Article = {
      url: 'https://www.gutenberg.org/ebooks/1342',
      title: 'Pride and Prejudice by Jane Austen | Project Gutenberg',
      content: 'Pride and Prejudice is an 1813 novel by Jane Austen.\n\nIt follows the character development of Elizabeth Bennet.',
    };
    const { container } = render(<ReaderCanvas article={plainTextArticle} />);
    expect(screen.getByText(/Pride and Prejudice is an 1813 novel/i)).toBeInTheDocument();
    expect(screen.getByText(/It follows the character development/i)).toBeInTheDocument();
    const paragraphs = container.querySelectorAll('.reader-prose p');
    expect(paragraphs.length).toBe(2);
  });
});
