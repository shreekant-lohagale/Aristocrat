import { redirect } from 'next/navigation';
import { BackButton } from '@/components/common/BackButton';
import { getHostedCustomerAccountUrl } from '@/lib/shopify/customer-account-url';
import { hasCustomerAccountApiConfig } from '@/lib/shopify/customer-account';

export default function LoginPage() {
  if (hasCustomerAccountApiConfig()) redirect('/account/auth/login');
  const accountUrl = getHostedCustomerAccountUrl();
  if (accountUrl) redirect(accountUrl);
  return <main className="auth-page"><div className="auth-back"><BackButton href="/" label="Back to Home" /></div><section className="auth-card"><p className="auth-wordmark">House of Aristocrat</p><p className="eyebrow">Private client access</p><h1>Welcome Back</h1><p className="auth-error" role="alert">Secure customer access is managed by Shopify. Please contact us if the account link is unavailable.</p></section></main>;
}
