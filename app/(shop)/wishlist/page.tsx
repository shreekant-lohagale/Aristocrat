import { BackButton } from '@/components/common/BackButton';
import { WishlistGrid } from '@/components/wishlist/WishlistGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your Wishlist', description: 'Your saved House of Aristocrat pieces.', robots: { index: false, follow: false } };

export default function WishlistPage() { return <main className="page shell"><BackButton href="/" label="Back to Home" /><p className="eyebrow search-kicker">Saved for later</p><h1>Your wishlist</h1><WishlistGrid /></main>; }
