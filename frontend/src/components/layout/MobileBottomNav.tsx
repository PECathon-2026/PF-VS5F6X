import React from 'react';
import { AppView } from '../../types/article';

export interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onToggleMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onToggleMenu,
}) => {
  const items: { view?: AppView; label: string; icon: string; action?: () => void }[] = [
    { view: 'dashboard', label: 'Home', icon: '🏠' },
    { view: 'reader', label: 'Read', icon: '📖' },
    { view: 'library', label: 'Library', icon: '📚' },
    { view: 'discover', label: 'Discover', icon: '🧭' },
    { label: 'Menu', icon: '☰', action: onToggleMenu },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom, 0px))',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {items.map((item, idx) => {
        const isActive = item.view ? currentView === item.view || (item.view === 'reader' && currentView === 'landing') : false;
        return (
          <button
            key={idx}
            onClick={() => {
              if (item.action) {
                item.action();
              } else if (item.view) {
                onNavigate(item.view);
              }
            }}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.35rem 0.2rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 600 : 500, letterSpacing: '-0.01em' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
