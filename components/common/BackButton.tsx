'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
export function BackButton() { const router = useRouter(); return <button className="back-button" onClick={() => window.history.length > 1 ? router.back() : router.push('/')}><ArrowLeft size={16} /> Back</button>; }
