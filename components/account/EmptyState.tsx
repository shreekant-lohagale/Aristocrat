import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export function AccountEmptyState({ icon: Icon, title, description, ctaHref, ctaLabel }: { icon: LucideIcon; title: string; description: string; ctaHref?: string; ctaLabel?: string }) {
  return <section className="account-empty-state"><Icon size={28} aria-hidden="true" /><h2>{title}</h2><p>{description}</p>{ctaHref && ctaLabel && <Link className="button" href={ctaHref}>{ctaLabel}</Link>}</section>;
}
