import { BackButton } from '@/components/common/BackButton';
import { SearchExperience } from '@/components/search/SearchExperience';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Search', description: 'Search House of Aristocrat collections and products.', robots: { index: false, follow: true } };

export default function SearchPage() { return <main className="page shell"><BackButton href="/" label="Back to Home" /><p className="eyebrow search-kicker">Discover House of Aristocrat</p><h1>Search</h1><SearchExperience /></main>; }
