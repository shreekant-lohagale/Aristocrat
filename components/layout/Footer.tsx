import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div><Image className="footer-logo" src={asset('House_of_Aristocrat_Logo_Transparent_2000px.png')} alt="House of Aristocrat" width={250} height={58} /><p className="eyebrow">Join the House</p><p className="footer-copy">Private edits, new collections and stories from House of Aristocrat.</p><form className="newsletter-form"><input suppressHydrationWarning aria-label="Email address" placeholder="Your email address" type="email" /><button suppressHydrationWarning aria-label="Subscribe"><ArrowUpRight /></button></form></div><div><p className="eyebrow">Client care</p>{['Contact', 'Shipping & returns', 'Size guide', 'Track order'].map((label) => <Link key={label} href={`/${label.toLowerCase().replaceAll(' ', '-').replace('&-', '')}`}>{label}</Link>)}</div><div><p className="eyebrow">Stay connected</p>{['Instagram', 'Pinterest', 'Journal', 'About us'].map((label) => <a key={label} href="#">{label}</a>)}</div></div><div className="shell footer-bottom"><span>© 2026 HOUSE OF ARISTOCRAT</span><span>Privacy · Terms</span></div></footer>;
}