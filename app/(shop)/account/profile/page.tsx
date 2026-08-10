import { requireAccountUser } from '@/lib/auth/account';
import { AccountShell } from '@/components/account/AccountShell';
import { AccountHeader } from '@/components/account/AccountHeader';
import { ProfileForm } from '@/components/account/ProfileForm';

export default async function ProfilePage() {
  const user = await requireAccountUser();
  return <AccountShell user={user}><AccountHeader title="Profile">Keep your preferred contact details ready for a more considered checkout.</AccountHeader><ProfileForm user={user} /></AccountShell>;
}
