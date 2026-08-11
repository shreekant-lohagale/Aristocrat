'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Playfair_Display, Poppins } from 'next/font/google';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-playfair-hero', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins-hero', display: 'swap' });

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => { gsap.fromTo('.hero-editorial-copy > *', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .1, delay: .12 }); gsap.fromTo('.hero-editorial-visual', { autoAlpha: 0, x: 24, scale: .985 }, { autoAlpha: 1, x: 0, scale: 1, duration: 1.05, ease: 'power3.out', delay: .08 }); }, heroRef);
    return () => context.revert();
  }, []);
  const parallax = (event: React.MouseEvent<HTMLElement>) => { if (!modelRef.current || window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) return; const bounds = event.currentTarget.getBoundingClientRect(); gsap.to(modelRef.current, { y: ((event.clientY - bounds.top) / bounds.height - .5) * -8, x: ((event.clientX - bounds.left) / bounds.width - .5) * 5, duration: .8, ease: 'power2.out', overwrite: 'auto' }); };
  return <section ref={heroRef} className={`${playfair.variable} ${poppins.variable} hero hero-editorial`} onMouseMove={parallax}><div className="hero-editorial-overlay" /><div className="hero-editorial-copy"><div className="hero-label"><span>Everyday Luxury</span></div><p className="hero-brand">House of Aristocrat</p><h1 className="hero-title"><span>Elevated</span><span>Everyday</span><i>Fashion</i></h1><p className="hero-description">Timeless Indian elegance and modern Indo-Western silhouettes, thoughtfully designed to make every day feel extraordinary.</p><div className="hero-editorial-actions"><Link className="hero-shop-button" href="/collections/new-arrivals">Shop Collection <ArrowRight size={16} strokeWidth={1.6} /></Link><Link className="hero-best-link" href="/collections/best-sellers">Discover Best Sellers</Link></div></div><div ref={modelRef} className="hero-editorial-visual"><div className="hero-model-glow" /><div className="hero-model"><Image src={`/api/assets?file=${encodeURIComponent('Brand Hero Pic.png')}`} alt="" aria-hidden priority sizes="(max-width: 768px) 100vw, 45vw" fill className="hero-model-blur" /><Image src={`/api/assets?file=${encodeURIComponent('Brand Hero Pic.png')}`} alt="House of Aristocrat editorial fashion model" priority sizes="(max-width: 768px) 100vw, 45vw" fill className="hero-model-main" /></div></div></section>;
}
