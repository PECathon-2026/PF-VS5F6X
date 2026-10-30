/**
 * SmallWebReader — Animation Constants & Utilities
 * Consistent motion design system. All animations respect prefers-reduced-motion.
 */

export const DURATIONS = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  page: 0.35,
} as const;

export const EASINGS = {
  smooth: [0.16, 1, 0.3, 1] as [number, number, number, number],
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  decel: [0, 0.55, 0.45, 1] as [number, number, number, number],
  snappy: [0.22, 0.68, 0, 1] as [number, number, number, number],
};

/** Fade + slide up entrance */
export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: DURATIONS.normal, ease: EASINGS.smooth },
};

/** Simple fade */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATIONS.fast },
};

/** Scale + fade for modals/dialogs */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: DURATIONS.normal, ease: EASINGS.smooth },
};

/** Slide from left for sidebar */
export const slideFromLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: DURATIONS.normal, ease: EASINGS.smooth },
};

/** Slide from right for panels */
export const slideFromRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: DURATIONS.normal, ease: EASINGS.smooth },
};

/** Slide from bottom for toasts */
export const slideFromBottom = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 24 },
  transition: { duration: DURATIONS.fast, ease: EASINGS.smooth },
};

/** Stagger children helper */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** Stagger child item */
export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATIONS.normal, ease: EASINGS.smooth } },
};

/** Button hover scale */
export const buttonHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: DURATIONS.instant },
};

/** Card hover lift */
export const cardHover = {
  whileHover: { y: -2, boxShadow: '0 8px 24px rgba(31,30,29,0.1)' },
  transition: { duration: DURATIONS.fast, ease: EASINGS.smooth },
};
