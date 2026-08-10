import type { ReactNode } from 'react';

export function AccountHeader({ title, children }: { title: string; children: ReactNode }) {
  return <header className="account-page-header"><p className="eyebrow">House of Aristocrat · My account</p><h1>{title}</h1><p>{children}</p></header>;
}
