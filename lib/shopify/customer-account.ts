import { cookies } from 'next/headers';
import type { CustomerAccountState } from '@/types/account';
import { getShopifyStoreDomain } from './config';

export const customerCookieNames = {
  accessToken: 'hoa_customer_access',
  idToken: 'hoa_customer_id',
  state: 'hoa_customer_oauth_state',
  verifier: 'hoa_customer_pkce',
  checked: 'hoa_customer_checked',
} as const;

type OpenIdConfiguration = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
};

type CustomerApiConfiguration = { graphql_api: string };

export function getCustomerAccountClientId() {
  return process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim() || null;
}

export function hasCustomerAccountApiConfig() {
  return Boolean(getShopifyStoreDomain() && getCustomerAccountClientId());
}

async function discover<T>(path: string): Promise<T> {
  const domain = getShopifyStoreDomain();
  if (!domain) throw new Error('Shopify store domain is not configured');
  const response = await fetch(`https://${domain}${path}`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Shopify customer discovery failed (${response.status})`);
  return response.json() as Promise<T>;
}

export function getCustomerOpenIdConfiguration() {
  return discover<OpenIdConfiguration>('/.well-known/openid-configuration');
}

export function getCustomerApiConfiguration() {
  return discover<CustomerApiConfiguration>('/.well-known/customer-account-api');
}

export async function getCustomerAccountState(): Promise<CustomerAccountState> {
  if (!hasCustomerAccountApiConfig()) return { status: 'unconfigured' };
  const accessToken = (await cookies()).get(customerCookieNames.accessToken)?.value;
  if (!accessToken) return { status: 'unauthenticated' };

  try {
    const { graphql_api: endpoint } = await getCustomerApiConfiguration();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query AccountDashboard {
          customer {
            firstName
            lastName
            displayName
            emailAddress { emailAddress }
            addresses(first: 1) { nodes { id } }
            orders(first: 1, reverse: true) { nodes { id } }
          }
        }`,
      }),
      cache: 'no-store',
    });

    if (response.status === 401) return { status: 'unauthenticated' };
    if (!response.ok) return { status: 'error' };
    const payload = await response.json() as {
      data?: { customer?: {
        firstName: string | null;
        lastName: string | null;
        displayName: string;
        emailAddress: { emailAddress: string | null } | null;
        addresses: { nodes: Array<{ id: string }> };
        orders: { nodes: Array<{ id: string }> };
      } };
      errors?: unknown[];
    };
    const customer = payload.data?.customer;
    if (!customer || payload.errors?.length) return { status: 'error' };

    return {
      status: 'authenticated',
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        displayName: customer.displayName,
        email: customer.emailAddress?.emailAddress || null,
        hasAddresses: customer.addresses.nodes.length > 0,
        hasOrders: customer.orders.nodes.length > 0,
      },
    };
  } catch {
    return { status: 'error' };
  }
}
