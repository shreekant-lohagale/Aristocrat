import { redirect } from 'next/navigation';
import { getAccountUser } from '@/lib/auth/account';
import { BackButton } from '@/components/common/BackButton';

type LoginPageProps = { searchParams: Promise<{ error?: string }> };
export default async function LoginPage({ searchParams }: LoginPageProps) { if (await getAccountUser()) redirect('/account'); const { error } = await searchParams; return <main className="auth-page"><div className="auth-back"><BackButton href="/" label="Back to Home" /></div><section className="auth-card"><p className="auth-wordmark">House of Aristocrat</p><p className="eyebrow">Private client access</p><h1>Welcome Back</h1><p>Access your orders, addresses and account.</p>{error && <p className="auth-error" role="alert">{error === 'configuration' ? 'Customer sign-in is being configured. Please try again shortly.' : 'We couldn’t sign you in. Please try again.'}</p>}<a className="google-sign-in" href="/api/customer-auth/login">Continue to sign in</a><p className="auth-coming-soon">Secure email, Google and Shop sign-in are managed by Shopify.</p></section></main>; }
