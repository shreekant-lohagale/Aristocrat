'use client';
import { ChevronDown, Globe2 } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/context/StoreProvider';
export function CountrySelector() { const { country, countries, setCountry } = useStore(); const [open, setOpen] = useState(false); return <div className="country-selector"><button className="country-trigger" onClick={() => setOpen(!open)} aria-expanded={open}><Globe2 size={16} /><span>{country.flag} {country.name}</span><small>{country.currency}</small><ChevronDown size={14} /></button>{open && <div className="country-menu">{countries.map((entry) => <button key={entry.code} onClick={() => { setCountry(entry); setOpen(false); }} className={entry.code === country.code ? 'active' : ''}><span>{entry.flag} {entry.name}</span><small>{entry.currency} {entry.symbol}</small></button>)}</div>}</div>; }
