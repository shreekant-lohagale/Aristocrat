import { AccountHeader } from '@/components/account/AccountHeader';
import { AccountShell } from '@/components/account/AccountShell';
import { WishlistPreview } from '@/components/account/WishlistPreview';
import { getCustomerAccountState } from '@/lib/shopify/customer-account';
import { getHostedCustomerAccountUrl } from '@/lib/shopify/customer-account-url';

export default async function AccountWishlistPage() {
  const accountState = await getCustomerAccountState();
  const authenticated = accountState.status === 'authenticated';
  const user = authenticated ? { name: accountState.customer.displayName, email: accountState.customer.email } : undefined;
  const accountHref = getHostedCustomerAccountUrl() || '/account/login';
  return <AccountShell user={user} authenticated={authenticated} error={accountState.status === 'error'} accountHref={accountHref}><AccountHeader title="My Wishlist">Your saved House of Aristocrat pieces, ready whenever you are.</AccountHeader><section className="account-content-section"><WishlistPreview showAll /></section></AccountShell>;
}
