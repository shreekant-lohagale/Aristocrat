import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export function AccountEmptyState({ icon: Icon, title, description, ctaHref, ctaLabel, onCta }: { icon: LucideIcon; title: string; description: string; ctaHref?: string; ctaLabel?: string; onCta?: () => void }) {
  return <section className="account-empty-state"><Icon size={28} aria-hidden="true" /><h2>{title}</h2><p>{description}</p>{ctaHref && ctaLabel && <Link className="button" href={ctaHref}>{ctaLabel}</Link>}{onCta && ctaLabel && <button className="button" type="button" onClick={onCta}>{ctaLabel}</button>}</section>;
}
