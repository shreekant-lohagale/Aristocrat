import { getCustomerApiConfiguration } from './customer-account';

export const customerWishlistMetafield = {
  namespace: 'custom',
  key: 'wishlist',
  type: 'json',
} as const;

type CustomerWishlistRecord = {
  customerId: string;
  wishlist: string[];
  compareDigest: string | null;
};

type CustomerWishlistQuery = {
  data?: {
    customer?: {
      id: string;
      metafield: { value: string; compareDigest: string } | null;
    };
  };
  errors?: Array<{ message?: string }>;
};

export function normalizeWishlist(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.flatMap((entry) => {
    if (typeof entry !== 'string') return [];
    const identifier = entry.trim();
    return identifier && identifier.length <= 255 ? [identifier] : [];
  }))].slice(0, 250);
}

export function parseWishlist(value?: string): string[] {
  if (!value) return [];
  try {
    return normalizeWishlist(JSON.parse(value));
  } catch {
    return [];
  }
}

async function customerRequest<T>(accessToken: string, query: string, variables?: Record<string, unknown>) {
  const { graphql_api: endpoint } = await getCustomerApiConfiguration();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (response.status === 401) throw new CustomerWishlistError('unauthenticated', 401);
  if (!response.ok) throw new CustomerWishlistError('customer-api-unavailable', 502);
  return response.json() as Promise<T>;
}

export class CustomerWishlistError extends Error {
  constructor(public code: string, public status: number) {
    super(code);
  }
}

export async function readCustomerWishlist(accessToken: string): Promise<CustomerWishlistRecord> {
  const payload = await customerRequest<CustomerWishlistQuery>(accessToken, `query CustomerWishlist {
    customer {
      id
      metafield(namespace: "${customerWishlistMetafield.namespace}", key: "${customerWishlistMetafield.key}") {
        value
        compareDigest
      }
    }
  }`);
  const customer = payload.data?.customer;
  if (!customer || payload.errors?.length) throw new CustomerWishlistError('wishlist-read-failed', 502);
  return {
    customerId: customer.id,
    wishlist: parseWishlist(customer.metafield?.value),
    compareDigest: customer.metafield?.compareDigest ?? null,
  };
}

export async function writeCustomerWishlist(accessToken: string, wishlist: string[]) {
  const current = await readCustomerWishlist(accessToken);
  const normalized = normalizeWishlist(wishlist);
  const payload = await customerRequest<{
    data?: {
      metafieldsSet?: {
        metafields: Array<{ value: string; compareDigest: string }> | null;
        userErrors: Array<{ code?: string; message: string }>;
      };
    };
    errors?: Array<{ message?: string }>;
  }>(accessToken, `mutation SetCustomerWishlist($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { value compareDigest }
      userErrors { code message }
    }
  }`, {
    metafields: [{
      ownerId: current.customerId,
      namespace: customerWishlistMetafield.namespace,
      key: customerWishlistMetafield.key,
      type: customerWishlistMetafield.type,
      value: JSON.stringify(normalized),
      compareDigest: current.compareDigest,
    }],
  });
  const result = payload.data?.metafieldsSet;
  if (!result || payload.errors?.length || result.userErrors.length) {
    const conflict = result?.userErrors.some((error) => error.code === 'STALE_OBJECT' || error.code === 'COMPARE_DIGEST_MISMATCH');
    throw new CustomerWishlistError(conflict ? 'wishlist-conflict' : 'wishlist-write-failed', conflict ? 409 : 502);
  }
  return normalizeWishlist(result.metafields?.[0] ? parseWishlist(result.metafields[0].value) : normalized);
}
