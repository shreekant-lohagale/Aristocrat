import { AccountHeader } from '@/components/account/AccountHeader';
import { AccountShell } from '@/components/account/AccountShell';
import { WishlistPreview } from '@/components/account/WishlistPreview';

export default function AccountWishlistPage() {
  return <AccountShell><AccountHeader title="My Wishlist">Your saved House of Aristocrat pieces, ready whenever you are.</AccountHeader><section className="account-content-section"><WishlistPreview showAll /></section></AccountShell>;
}
