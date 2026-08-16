import type { ReactNode } from 'react';
import Link from 'next/link';

type ExploreButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function ExploreButton({ href, children, className = '', ariaLabel }: ExploreButtonProps) {
  return <Link href={href} aria-label={ariaLabel} className={`explore-button ${className}`.trim()}><span aria-hidden="true" className="explore-button__glow" /><span className="explore-button__label">{children}</span></Link>;
}