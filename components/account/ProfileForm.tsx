'use client';

import { useEffect, useState } from 'react';
import type { AccountUser } from '@/lib/auth/account';

const profileKey = 'house-of-aristocrat-profile';
type ProfileFields = { phone: string; dateOfBirth: string };

export function ProfileForm({ user }: { user: AccountUser }) {
  const [values, setValues] = useState<ProfileFields>({ phone: '', dateOfBirth: '' });
  const [saved, setSaved] = useState(false);
  useEffect(() => { try { setValues((current) => ({ ...current, ...JSON.parse(localStorage.getItem(profileKey) || '{}') })); } catch { /* Ignore corrupt local profile data. */ } }, []);
  const update = (field: keyof ProfileFields, value: string) => setValues((current) => ({ ...current, [field]: value }));
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); localStorage.setItem(profileKey, JSON.stringify(values)); setSaved(true); window.setTimeout(() => setSaved(false), 2400); };

  return <form className="profile-form" onSubmit={submit}><div className="profile-form__identity"><div className="account-identity__avatar">{user.image ? <img src={user.image} alt="" /> : <span>{user.name?.slice(0, 1) || 'A'}</span>}</div><p>Your Google profile image is managed through your Google account.</p></div><div className="profile-form__grid"><label>Full name<input value={user.name || ''} readOnly /></label><label>Email<input value={user.email || ''} readOnly /></label><label>Phone<input value={values.phone} onChange={(event) => update('phone', event.target.value)} inputMode="tel" placeholder="Add phone number" /></label><label>Date of birth<input value={values.dateOfBirth} onChange={(event) => update('dateOfBirth', event.target.value)} type="date" /></label></div><footer><span>{saved ? 'Profile details saved on this device.' : 'Email and name are securely provided by Google.'}</span><button type="submit">Save details</button></footer></form>;
}

