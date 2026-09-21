import type { Metadata } from 'next';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Size Guide', description: 'Size guidance for House of Aristocrat clothing categories.', alternates: { canonical: '/size-guide' }, robots: { index: false, follow: true } };

const categories = ['Kurtis', 'Dresses', 'Indo-Western', 'Chaniya Choli'] as const;

export default function SizeGuidePage() {
  return <InformationPage eyebrow="Fit notes" title="Size guide" intro="Category-specific measurements are being confirmed. Select the available size on each product page when shopping.">
    {categories.map((category) => <section key={category}><h2>{category}</h2><p>The verified {category} size chart has not been added yet. Please use the size options and fit details supplied with the individual product.</p></section>)}
    <aside className="information-page__notice">No body or garment measurements are published here until the client confirms the category charts.</aside>
  </InformationPage>;
}
