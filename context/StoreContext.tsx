'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    addToCart,
    getCartItems,
    increaseCartItemQuantity,
    decreaseCartItemQuantity,
    removeFromCart,
    getCartTotals,
} from '@/lib/actions/cart.action';
import { getUserIdFromCookie } from '@/lib/auth';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

type ProductType = {
    id: string;
    name: string;
    image: any;
    price: number;
    description: string;
    category: string;
    images: { url: string }[];
    priceWithDiscount?: number | null;
};

type CartItem = {
    id: string;
    product: ProductType;
    quantity: number;
};

type StoreContextType = {
    handleAddToCart: (productId: string) => Promise<void>;
    cart: CartItem[];
    handleRemoveFromCart: (productId: string) => Promise<void>;
    increaseAmount: (productId: string) => Promise<void>;
    decreaseAmount: (productId: string) => Promise<void>;
    cartTotal: number;
    itemAmount: number;
    updateCart: () => Promise<void>;
};

export const StoreContext = createContext<StoreContextType | null>(null);

export function StoreContextProvider({ children }: { children: React.ReactNode }) {
    const t = useTranslations('StoreContext');

    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [itemAmount, setItemAmount] = useState(0);

    const updateCart = async () => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) {
                setCart([]);
                setItemAmount(0);
                setCartTotal(0);
                return;
            }

            const cartItems = await getCartItems(userId);
            const { itemAmount, cartTotal } = await getCartTotals(userId);

            setCart(
                cartItems.map((item: any) => ({
                    id: item.id,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        image: item.product.images[0]?.url || '/placeholder.png',
                        price: item.product.price,
                        priceWithDiscount: item.product.priceWithDiscount,
                        description: item.product.description,
                        category: item.product.categoryId,
                        images: item.product.images,
                    },
                    quantity: item.quantity,
                })),
            );
            setItemAmount(itemAmount);
            setCartTotal(cartTotal);
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error(t('updateCartFailed'));
        }
    };

    useEffect(() => {
        updateCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddToCart = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) {
                toast.error(t('loginAddToCart'));
                return;
            }

            const result = await addToCart(userId, productId);
            if (result.success) {
                await updateCart();
                toast(t('addToCartSuccess'));
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error(t('addToCartFailed'));
        }
    };

    const handleRemoveFromCart = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await removeFromCart(userId, productId);
            if (result.success) {
                await updateCart();
                toast(t('removeFromCartSuccess'));
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error(t('removeFromCartFailed'));
        }
    };

    const increaseAmount = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await increaseCartItemQuantity(userId, productId);
            if (result.success) {
                await updateCart();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
            toast.error(t('increaseAmountFailed'));
        }
    };

    const decreaseAmount = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await decreaseCartItemQuantity(userId, productId);
            if (result.success) {
                await updateCart();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            toast.error(t('decreaseAmountFailed'));
        }
    };

    const contextValue = {
        handleAddToCart,
        cart,
        handleRemoveFromCart,
        increaseAmount,
        decreaseAmount,
        cartTotal,
        itemAmount,
        updateCart,
    };

    return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreContext');
    }
    return context;
};
