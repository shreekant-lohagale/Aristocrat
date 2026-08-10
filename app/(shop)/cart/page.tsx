import { CartSummary } from '@/components/cart/CartSummary';
import { BackButton } from '@/components/common/BackButton';

export default function CartPage() { return <main className="page shell"><BackButton href="/" label="Back to Home" /><p className="eyebrow">Your selection</p><h1>Your bag</h1><CartSummary /></main>; }
