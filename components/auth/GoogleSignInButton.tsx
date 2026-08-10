'use client';

import { useTransition } from 'react';
import { signIn } from 'next-auth/react';

function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.23-.2-1.78H12v3.42h5.52c-.11.85-.72 2.13-2.08 2.99l-.02.11 3.02 2.34.21.02c1.92-1.77 3-4.37 3-7.1Z" /><path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.62-2.42l-3.15-2.44c-.84.59-1.97 1-3.47 1a6 6 0 0 1-5.68-4.14l-.1.01-3.14 2.44-.03.1A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.32 14.14A6.16 6.16 0 0 1 6 12c0-.74.13-1.46.31-2.14v-.14L3.14 7.24l-.1.05A10 10 0 0 0 2 12c0 1.7.41 3.3 1.04 4.7l3.28-2.56Z" /><path fill="#EA4335" d="M12 5.87c1.9 0 3.18.82 3.91 1.5l2.85-2.78C16.95 2.9 14.7 2 12 2A10 10 0 0 0 3.04 7.3l3.27 2.56A6 6 0 0 1 12 5.87Z" /></svg>;
}

export function GoogleSignInButton() {
  const [pending, startTransition] = useTransition();
  return <button type="button" className="google-sign-in" disabled={pending} onClick={() => startTransition(() => { void signIn('google', { redirectTo: '/account' }); })}><GoogleMark />{pending ? 'Connecting…' : 'Continue with Google'}</button>;
}
