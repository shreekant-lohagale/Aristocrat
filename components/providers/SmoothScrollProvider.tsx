'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { useEffect } from 'react';

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 767px)');
    let lenis: Lenis | null = null;

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!link || !hash || hash === '#') return;
      const destination = document.querySelector(hash);
      if (!(destination instanceof HTMLElement) || !lenis) return;

      event.preventDefault();
      window.history.pushState(null, '', hash);
      lenis.scrollTo(destination, { duration: 1.15, offset: -8 });
    };

    const destroy = () => {
      if (!lenis) return;
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenis = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };

    const update = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const initialise = () => {
      destroy();
      if (reducedMotion.matches || mobileViewport.matches) return;

      lenis = new Lenis({
        autoRaf: false,
        duration: 1.18,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1,
      });

      document.documentElement.classList.add('lenis', 'lenis-smooth');
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
      document.addEventListener('click', onAnchorClick);
    };

    initialise();
    reducedMotion.addEventListener('change', initialise);
    mobileViewport.addEventListener('change', initialise);

    return () => {
      reducedMotion.removeEventListener('change', initialise);
      mobileViewport.removeEventListener('change', initialise);
      destroy();
    };
  }, []);

  return children;
}

