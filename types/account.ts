export type AccountUser = { name?: string | null; email?: string | null; image?: string | null };

export type CustomerAccountData = {
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  email: string | null;
  hasAddresses: boolean;
  hasOrders: boolean;
};

export type CustomerAccountState =
  | { status: 'unconfigured' | 'unauthenticated' }
  | { status: 'error' }
  | { status: 'authenticated'; customer: CustomerAccountData };
