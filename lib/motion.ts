import type { Transition, Variants } from 'framer-motion';

export const editorialEase = [0.22, 0.61, 0.36, 1] as const;
export const revealTransition: Transition = { duration: 0.52, ease: editorialEase };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.025 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.72, ease: editorialEase } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.04 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: editorialEase } },
};

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const drawerRight: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: editorialEase } },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.22, ease: editorialEase } },
};

export const drawerBottom: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: editorialEase } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: editorialEase } },
};

export const viewportOnce = { once: true, amount: 0.18 } as const;
