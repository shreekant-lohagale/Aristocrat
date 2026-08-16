'use client';

import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useStore } from '@/context/StoreProvider';

export function CountrySelector() {
  const { country, countries, setCountry } = useStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return <div ref={rootRef} className="country-selector">
    <button suppressHydrationWarning type="button" className="country-trigger" aria-expanded={open} aria-controls={menuId} aria-haspopup="menu" onClick={() => setOpen((current) => !current)}>
      <Globe2 size={16} aria-hidden="true" /><span>{country.flag} {country.name}</span><small>{country.currency}</small><ChevronDown className={open ? 'country-trigger__chevron is-open' : 'country-trigger__chevron'} size={14} aria-hidden="true" />
    </button>
    {open && <div id={menuId} className="country-menu" role="menu" aria-label="Choose shipping country">
      <p className="country-menu__label">Ship to</p>
      <div className="country-menu__options">{countries.map((entry) => {
        const selected = entry.code === country.code;
        return <button suppressHydrationWarning type="button" role="menuitemradio" aria-checked={selected} key={entry.code} onClick={() => { setCountry(entry); setOpen(false); }} className={selected ? 'active' : ''}>
          <span><b aria-hidden="true">{entry.flag}</b>{entry.name}</span><small>{entry.currency}</small><i aria-hidden="true">{selected ? <Check size={14} /> : null}</i>
        </button>;
      })}</div>
    </div>}
  </div>;
}