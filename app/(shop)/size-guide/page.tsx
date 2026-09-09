import type { Metadata } from 'next';
import { InformationPage } from '@/components/common/InformationPage';

export const metadata: Metadata = { title: 'Size Guide', description: 'House of Aristocrat fit and measurement guidance.' };

export default function SizeGuidePage() {
  return <InformationPage eyebrow="Fit notes" title="Size guide" intro="Use your body measurements together with the size options shown on each product page.">
    <section><h2>How to measure</h2><dl className="information-page__definitions"><div><dt>Bust</dt><dd>Measure around the fullest part of the bust, keeping the tape level.</dd></div><div><dt>Waist</dt><dd>Measure around your natural waist without pulling the tape tight.</dd></div><div><dt>Hip</dt><dd>Measure around the fullest part of your hips with your feet together.</dd></div><div><dt>Length</dt><dd>Measure from the highest shoulder point to your preferred finished length.</dd></div></dl></section>
    <section><h2>Choosing your size</h2><p>Product silhouettes and ease vary. Prioritise the product-specific options and fit information shown on the item page. If you fall between sizes, consider the garment shape and the fit you prefer.</p></section>
  </InformationPage>;
}
