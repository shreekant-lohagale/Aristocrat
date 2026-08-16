import type { ReactNode } from 'react';
import Link from 'next/link';

type DiscoverButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function DiscoverButton({ href, children, className = '' }: DiscoverButtonProps) {
  return <Link href={href} className={`discover-button ${className}`.trim()}><span className="discover-button__circle" aria-hidden="true" /><span className="discover-button__arrow" aria-hidden="true" /><span className="discover-button__text">{children}</span></Link>;
}