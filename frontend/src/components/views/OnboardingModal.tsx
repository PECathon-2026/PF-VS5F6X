import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to SmallWebReader',
      desc: 'The modern web is overloaded with sticky ads, tracking popups, and visual clutter. SmallWebReader extracts pure article prose and serves it on an immaculate reading canvas.',
      badge: 'Step 1 of 3: Pure Reading',
    },
    {
      title: 'Curate Your Aesthetic',
      desc: 'Choose from 8 distinct editorial themes—from Japanese wabi-sabi earthiness and Classical Academia to focused Dark Mono and electric Cyberpunk. Adjust typography, font sizes, and column widths to your exact comfort.',
      badge: 'Step 2 of 3: Personalized Typography',
    },
    {
      title: 'Local-First Library & Privacy',
      desc: 'Your reading history, bookmarks, and streaks stay private in your browser. Read offline, export articles to clean Markdown, and track your reading habits without trackers.',
      badge: 'Step 3 of 3: Private & Offline',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
      setStep(0);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Getting Started">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {steps[step].badge}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {steps[step].title}
        </h3>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {steps[step].desc}
        </p>

        {/* Step Indicator dots */}
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: i === step ? 'var(--accent)' : 'var(--border-subtle)',
                transition: 'all var(--transition-fast)',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Skip Tour
          </Button>
          <Button variant="primary" size="md" onClick={handleNext}>
            {step === steps.length - 1 ? 'Start Reading' : 'Continue →'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
