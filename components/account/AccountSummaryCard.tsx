import type { LucideIcon } from 'lucide-react';

export function AccountSummaryCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string | number; detail: string }) {
  return <article className="account-summary-card"><Icon size={19} aria-hidden="true" /><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>;
}
