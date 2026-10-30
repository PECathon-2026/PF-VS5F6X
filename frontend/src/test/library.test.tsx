import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LibraryView } from '../components/views/LibraryView';
import { addBookmark } from '../utils/storage';

describe('LibraryView', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty library state when no bookmarks exist', () => {
    render(<LibraryView onSelectArticleUrl={vi.fn()} onNotify={vi.fn()} />);
    expect(screen.getByText('Your library is empty')).toBeInTheDocument();
  });

  it('renders saved bookmarks and filters by search query', () => {
    addBookmark({
      url: 'https://example.com/essay',
      title: 'Deep Focus Essay',
      siteName: 'Focus Weekly',
      excerpt: 'Notes on focus.',
    });
    addBookmark({
      url: 'https://example.com/tech',
      title: 'JavaScript Evolution',
      siteName: 'Dev Digest',
      excerpt: 'JS trends.',
    });

    render(<LibraryView onSelectArticleUrl={vi.fn()} onNotify={vi.fn()} />);

    expect(screen.getByText('Deep Focus Essay')).toBeInTheDocument();
    expect(screen.getByText('JavaScript Evolution')).toBeInTheDocument();

    // Test search filter
    const searchInput = screen.getByPlaceholderText('Search saved articles...');
    fireEvent.change(searchInput, { target: { value: 'Focus' } });

    expect(screen.getByText('Deep Focus Essay')).toBeInTheDocument();
    expect(screen.queryByText('JavaScript Evolution')).not.toBeInTheDocument();
  });
});
