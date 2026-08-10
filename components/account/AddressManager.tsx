'use client';

import { MapPin, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addressStorageKey, type CustomerAddress } from '@/lib/account/addresses';
import { AccountEmptyState } from './EmptyState';

const addressSchema = z.object({ fullName: z.string().min(2, 'Enter your full name'), phone: z.string().min(6, 'Enter a valid phone number'), line1: z.string().min(3, 'Enter your address'), line2: z.string().optional(), city: z.string().min(2, 'Enter your city'), state: z.string().min(2, 'Enter your state or province'), country: z.string().min(2, 'Enter your country'), postalCode: z.string().min(3, 'Enter a postal code') });
type AddressFormValues = z.infer<typeof addressSchema>;
const blankAddress: AddressFormValues = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', country: '', postalCode: '' };

export function AddressManager() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [editing, setEditing] = useState<CustomerAddress | null | 'new'>(null);
  const form = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema), defaultValues: blankAddress });
  useEffect(() => { try { setAddresses(JSON.parse(localStorage.getItem(addressStorageKey) || '[]')); } catch { setAddresses([]); } }, []);
  const saveAddresses = (next: CustomerAddress[]) => { setAddresses(next); localStorage.setItem(addressStorageKey, JSON.stringify(next)); };
  const openForm = (address: CustomerAddress | 'new') => { setEditing(address); form.reset(address === 'new' ? blankAddress : address); };
  const submit = (values: AddressFormValues) => { const next = editing && editing !== 'new' ? addresses.map((address) => address.id === editing.id ? { ...address, ...values } : address) : [...addresses, { ...values, id: crypto.randomUUID(), isDefault: addresses.length === 0 }]; saveAddresses(next); setEditing(null); };
  const remove = (id: string) => saveAddresses(addresses.filter((address) => address.id !== id));
  const setDefault = (id: string) => saveAddresses(addresses.map((address) => ({ ...address, isDefault: address.id === id })));

  return <>{addresses.length ? <div className="address-list">{addresses.map((address) => <article key={address.id} className="address-card"><div><p>{address.isDefault && <span className="address-card__default">Default</span>}</p><h2>{address.fullName}</h2><p>{address.line1}{address.line2 && `, ${address.line2}`}<br />{address.city}, {address.state} {address.postalCode}<br />{address.country}<br />{address.phone}</p></div><div className="address-card__actions"><button type="button" onClick={() => openForm(address)}><Pencil size={15} /> Edit</button><button type="button" onClick={() => setDefault(address.id)} disabled={address.isDefault}><Star size={15} /> Default</button><button type="button" onClick={() => remove(address.id)}><Trash2 size={15} /> Delete</button></div></article>)}</div> : <AccountEmptyState icon={MapPin} title="No saved addresses" description="Add a delivery address to make checkout feel effortless." /> }<button type="button" className="account-outline-button" onClick={() => openForm('new')}><Plus size={16} /> Add address</button>{editing && <div className="account-form-sheet" role="dialog" aria-modal="true" aria-label="Address form"><button className="account-form-sheet__scrim" aria-label="Close address form" onClick={() => setEditing(null)} /><form className="account-form-sheet__panel" onSubmit={form.handleSubmit(submit)} data-lenis-prevent><header><div><p className="eyebrow">Local address book</p><h2>{editing === 'new' ? 'Add address' : 'Edit address'}</h2></div><button type="button" aria-label="Close address form" onClick={() => setEditing(null)}><X size={20} /></button></header><div className="account-form-grid">{(['fullName', 'phone', 'line1', 'line2', 'city', 'state', 'country', 'postalCode'] as const).map((field) => <label key={field} className={field === 'line1' || field === 'line2' ? 'wide' : ''}>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}<input {...form.register(field)} />{form.formState.errors[field] && <small>{form.formState.errors[field]?.message}</small>}</label>)}</div><footer><button type="button" onClick={() => setEditing(null)}>Cancel</button><button type="submit">Save address</button></footer></form></div>}</>;
}
