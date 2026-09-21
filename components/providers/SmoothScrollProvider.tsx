'use client';

import type Lenis from 'lenis';
import type gsap from 'gsap';
import { useEffect } from 'react';

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 1023px), (pointer: coarse)');
    let lenis: Lenis | null = null;
    let ticker: typeof gsap | null = null;
    let generation = 0;

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
      generation += 1;
      if (!lenis) return;
      document.removeEventListener('click', onAnchorClick);
      ticker?.ticker.remove(update);
      lenis.destroy();
      lenis = null;
      ticker = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };

    const update = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const initialise = () => {
      destroy();
      if (reducedMotion.matches || mobileViewport.matches) return;
      const current = generation;
      void Promise.all([import('lenis'), import('gsap')]).then(([lenisModule, gsapModule]) => {
        if (current !== generation || reducedMotion.matches || mobileViewport.matches) return;
        lenis = new lenisModule.default({
          autoRaf: false,
          duration: 1.18,
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1,
        });
        ticker = gsapModule.default;
        document.documentElement.classList.add('lenis', 'lenis-smooth');
        ticker.ticker.add(update);
        ticker.ticker.lagSmoothing(0);
        document.addEventListener('click', onAnchorClick);
      }).catch(() => {
        if (current === generation) destroy();
        // Native scrolling remains available if the optional desktop modules fail to load.
      });
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

