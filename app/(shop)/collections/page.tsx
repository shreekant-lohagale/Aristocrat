import { CatalogGrid } from '@/components/collection/CatalogGrid';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
export default function CollectionsPage() { return <><Navbar /><main className="collection-page shell"><section className="collection-hero"><p className="eyebrow">The House edit</p><h1>Collections</h1><p className="lede">Contemporary occasionwear, designed for the moments that become memories.</p></section><CatalogGrid /></main><Footer /></>; }