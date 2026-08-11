import { redirect } from 'next/navigation';
import { getHostedCustomerAccountUrl } from '@/lib/shopify/customer-account-url';
export default function AccountPage() { redirect(getHostedCustomerAccountUrl() || '/account/login'); }
