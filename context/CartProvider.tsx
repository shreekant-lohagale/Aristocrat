'use client';
import { createContext, useContext, useState } from 'react';
const CartContext = createContext({ count: 0, setCount: (_count: number) => {} });
export function CartProvider({ children }: { children: React.ReactNode }) { const [count, setCount] = useState(0); return <CartContext.Provider value={{ count, setCount }}>{children}</CartContext.Provider>; }
export const useCartContext = () => useContext(CartContext);
