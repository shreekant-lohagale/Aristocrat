import type { LucideIcon } from 'lucide-react';

export function AccountSummaryCard({ icon: Icon, label, value, detail, href }: { icon: LucideIcon; label: string; value: string | number; detail: string; href: string }) {
  return <a className="account-summary-card" href={href}><Icon size={19} aria-hidden="true" /><p>{label}</p><strong>{value}</strong><small>{detail}</small></a>;
}
