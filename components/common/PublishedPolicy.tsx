import type { PublishedShopPolicy } from '@/lib/shopify/shop-information';
import { publishedPolicyText, publishedPolicyUrl } from '@/lib/shopify/shop-information';

export function PublishedPolicy({ policy, id, unavailable }: { policy: PublishedShopPolicy | null | undefined; id?: string; unavailable: string }) {
  const body = policy?.body ? publishedPolicyText(policy.body) : '';
  const url = policy?.url ? publishedPolicyUrl(policy.url) : null;

  if (!body) return <p id={id} className="information-page__notice">{unavailable}</p>;

  return <section id={id} className="information-page__published-policy" aria-label={policy?.title || 'Published policy'}>
    <h2>{policy?.title}</h2>
    <div className="information-page__policy-text">{body}</div>
    {url && <a href={url} target="_blank" rel="noopener noreferrer">View the original published policy <span aria-hidden="true">↗</span></a>}
  </section>;
}
