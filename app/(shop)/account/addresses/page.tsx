import { requireAccountUser } from '@/lib/auth/account';
import { AccountShell } from '@/components/account/AccountShell';
import { AccountHeader } from '@/components/account/AccountHeader';
import { AddressManager } from '@/components/account/AddressManager';

export default async function AddressesPage() {
  const user = await requireAccountUser();
  return <AccountShell user={user}><AccountHeader title="Saved Addresses">Addresses are stored locally on this device until Shopify customer addresses are connected.</AccountHeader><AddressManager /></AccountShell>;
}
