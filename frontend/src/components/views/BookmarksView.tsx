import React from 'react';
import { LibraryView } from './LibraryView';

export interface BookmarksViewProps {
  onSelectArticleUrl: (url: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  onSelectArticleUrl,
  onNotify,
}) => {
  return (
    <LibraryView
      onSelectArticleUrl={onSelectArticleUrl}
      onNotify={onNotify}
      initialTab="bookmarks"
    />
  );
};
