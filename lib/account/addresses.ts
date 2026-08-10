export type CustomerAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
};

export const addressStorageKey = 'house-of-aristocrat-addresses';
