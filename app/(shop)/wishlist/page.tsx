import { BackButton } from '@/components/common/BackButton';
import { WishlistGrid } from '@/components/wishlist/WishlistGrid';
export default function WishlistPage() { return <main className="page shell"><BackButton /><p className="eyebrow search-kicker">Saved for later</p><h1>Your wishlist</h1><WishlistGrid /></main>; }