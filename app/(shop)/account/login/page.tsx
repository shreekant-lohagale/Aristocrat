import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BackButton } from '@/components/common/BackButton';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

type LoginPageProps = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) redirect('/account');
  const { error } = await searchParams;

  return <main className="auth-page"><div className="auth-back"><BackButton href="/" label="Back to Home" /></div><section className="auth-card"><p className="auth-wordmark">House of Aristocrat</p><p className="eyebrow">Private client access</p><h1>Welcome Back</h1><p>Sign in to view your orders, wishlist and account.</p>{error && <p className="auth-error" role="alert">We could not complete your sign-in. Please try again.</p>}<GoogleSignInButton /><div className="auth-divider"><span>or</span></div><p className="auth-coming-soon">Email sign-in is coming soon.</p></section></main>;
}
