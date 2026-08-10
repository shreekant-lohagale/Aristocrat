import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
  href?: string;
  label?: string;
  className?: string;
};

export function BackButton({ href = '/', label = 'Back to Home', className = '' }: BackButtonProps) {
  return <Link href={href} className={`back-button ${className}`.trim()} aria-label={label}><ArrowLeft size={17} aria-hidden="true" /><span>{label}</span></Link>;
}
