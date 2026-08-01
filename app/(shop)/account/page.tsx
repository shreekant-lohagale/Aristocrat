import Link from 'next/link';
import { BackButton } from '@/components/common/BackButton';

export default function AccountPage() {
  return <main className="page shell"><BackButton /><p className="eyebrow search-kicker">House of Aristocrat</p><h1>Your account</h1><p className="lede">Sign in to follow orders, manage your saved pieces, and enjoy a more considered shopping experience.</p><Link className="button" href="/login">Sign in</Link></main>;
}
