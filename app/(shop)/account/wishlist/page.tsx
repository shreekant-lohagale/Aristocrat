import { requireAccountUser } from '@/lib/auth/account';
import { AccountShell } from '@/components/account/AccountShell';
import { AccountHeader } from '@/components/account/AccountHeader';
import { WishlistPreview } from '@/components/account/WishlistPreview';

export default async function AccountWishlistPage() {
  const user = await requireAccountUser();
  return <AccountShell user={user}><AccountHeader title="My Wishlist">Your saved House of Aristocrat pieces, ready whenever you are.</AccountHeader><WishlistPreview showAll /></AccountShell>;
}
