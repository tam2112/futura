'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type CartContextType = {
    itemAmount: number;
    updateCartAmount: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

import { getCartTotals } from '@/lib/actions/cart.action';
import { getUserIdFromCookie } from '@/lib/auth';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export function CartProvider({ children }: { children: ReactNode }) {
    const [itemAmount, setItemAmount] = useState(0);
    const { isLoggedIn } = useAuth();

    const updateCartAmount = async () => {
        if (!isLoggedIn) {
            setItemAmount(0);
            return;
        }

        try {
            const userId = await getUserIdFromCookie();
            if (!userId) {
                setItemAmount(0);
                return;
            }

            const { itemAmount: cartItemAmount } = await getCartTotals(userId);
            setItemAmount(cartItemAmount);
        } catch (error) {
            console.error('Error updating cart amount:', error);
            toast.error('Failed to update cart amount');
        }
    };

    return <CartContext.Provider value={{ itemAmount, updateCartAmount }}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
