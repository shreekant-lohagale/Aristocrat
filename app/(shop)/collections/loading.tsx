import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton';

export default function CollectionsLoading() {
  return <main className="collection-page"><div className="collection-page__inner"><ProductGridSkeleton count={12} /></div></main>;
}
