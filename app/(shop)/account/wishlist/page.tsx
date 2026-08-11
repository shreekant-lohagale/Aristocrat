import { BackButton } from '@/components/common/BackButton';
import { AccountHeader } from '@/components/account/AccountHeader';
import { WishlistPreview } from '@/components/account/WishlistPreview';
export default function AccountWishlistPage() { return <main className="account-dashboard shell"><BackButton href="/" label="Back to Home" /><section className="account-dashboard__content"><AccountHeader title="My Wishlist">Your saved House of Aristocrat pieces, ready whenever you are.</AccountHeader><WishlistPreview showAll /></section></main>; }
