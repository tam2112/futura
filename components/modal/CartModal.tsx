'use client';

import { useAnimate } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';
import CartItem from '../cart/CartItem';
import { useStore } from '@/context/StoreContext';
import CheckoutModal from './CheckoutModal';
import { useTranslations } from 'next-intl';

type CartModalType = {
    isOpenCart: boolean;
    setIsOpenCart: Dispatch<SetStateAction<boolean>>;
};

export default function CartModal({ isOpenCart, setIsOpenCart }: CartModalType) {
    const t = useTranslations('CartModal');

    const [cartScope, cartAnimate] = useAnimate();
    const [showOverlay, setShowOverlay] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { cart, cartTotal, itemAmount, updateCart } = useStore();

    useEffect(() => {
        if (isOpenCart) {
            updateCart();
            setShowOverlay(true);
            cartAnimate(
                cartScope.current,
                {
                    transform: 'translateX(0%)',
                },
                {
                    duration: 0.5,
                },
            );
        } else {
            cartAnimate(cartScope.current, {
                transform: 'translateX(100%)',
            });
            setTimeout(() => {
                setShowOverlay(false);
            }, 500); // Thời gian delay phải khớp với thời gian transition
        }
    }, [isOpenCart, cartAnimate, cartScope, updateCart]);

    return (
        <>
            {/* Overlay */}
            {showOverlay && (
                <div
                    className={twMerge(
                        'fixed inset-0 top-0 left-0 w-full h-full bg-black/50 opacity-0 transition-opacity duration-500 z-10',
                        isOpenCart && 'opacity-100',
                    )}
                    onClick={() => setIsOpenCart(false)}
                />
            )}

            {/* Modal */}
            <div
                className={twMerge(
                    'fixed top-0 right-0 h-[100dvh] translate-x-[0%] overflow-x-hidden hide-scrollbar bg-white shadow-md z-10 transition-all duration-500',
                    !isOpenCart && 'invisible',
                )}
                ref={cartScope}
            >
                <div className="w-[375px] h-full">
                    {/* cart heading */}
                    <div className="sticky bg-white z-50 top-0 left-0 right-0">
                        <div className="flex items-center justify-between border-b border-gray-200">
                            <div className="pl-4">
                                <h2 className="font-heading text-lg">
                                    {t('shoppingBag')} ({itemAmount})
                                </h2>
                            </div>
                            <div
                                className="text-black py-5 pl-4 pr-4 border-l border-gray-200 cursor-pointer"
                                onClick={() => setIsOpenCart(false)}
                            >
                                <HiOutlineXMark size={30} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between h-[90%]">
                        {/* cart item */}
                        <div className="mt-4 px-4 flex flex-col space-y-4 divide-y divide-gray-200 max-h-[525px] overflow-y-auto hide-scrollbar">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        productId={item.product.id}
                                        image={item.product.image}
                                        name={item.product.name}
                                        price={item.product.priceWithDiscount ?? item.product.price}
                                        quantity={item.quantity}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-4">{t('cartEmpty')}</div>
                            )}
                        </div>
                        {/* checkout */}
                        <div className="px-6 py-3 lg:py-6 mt-auto">
                            {/* total price */}
                            <div className="flex items-center justify-between mb-6 text-lg font-semibold">
                                <div>{t('total')}:</div>
                                <div>${cartTotal.toFixed(2)}</div>
                            </div>
                            {/* btn */}
                            <div className="flex flex-col gap-y-3">
                                <button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="py-2 bg-gradient font-semibold text-white flex justify-center rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    disabled={cart.length === 0}
                                >
                                    {t('checkout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <CheckoutModal isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} cartTotal={cartTotal} />
        </>
    );
}
