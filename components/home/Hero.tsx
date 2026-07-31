import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function Hero() { return <section className="hero"><img src="/api/images/Janvi-1.webp" alt="Model wearing Mahera occasionwear" /><div className="hero-content"><p className="eyebrow">The festive chapter · 2026</p><h1>A study in <i>celebration.</i></h1><Link className="button button-light" href="/collections">Shop the collection <ArrowUpRight size={15} /></Link></div></section>; }
