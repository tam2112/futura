'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { HiOutlineXMark } from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';
import { useAnimate } from 'framer-motion';
import { z } from 'zod';
import { DeliveryInfoSchema, deliveryInfoSchema } from '@/lib/validation/deliveryInfo.form';
import { createOrder } from '@/lib/actions/order.action';
import { useStore } from '@/context/StoreContext';
import { getUserIdFromCookie } from '@/lib/auth';
import { useRouter } from '@/navigation';
import SelectField from '../form/SelectField';
import { useLocale, useTranslations } from 'next-intl';

const paymentMethodSchema = z
    .object({
        paymentMethod: z.enum(['ewallet', 'creditCard']),
        ewalletProvider: z.string().optional(),
        cardNumber: z.string().optional(),
        bankName: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.paymentMethod === 'ewallet') {
                return !!data.ewalletProvider;
            }
            if (data.paymentMethod === 'creditCard') {
                return !!data.cardNumber && !!data.bankName;
            }
            return true;
        },
        {
            message: 'Please provide all required payment details',
            path: ['paymentMethod'],
        },
    );

type PaymentFormData = z.infer<typeof paymentMethodSchema>;

type CheckoutModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    cartTotal: number;
};

export default function CheckoutModal({ isOpen, setIsOpen, cartTotal }: CheckoutModalProps) {
    const t = useTranslations('CheckoutModal');
    const locale = useLocale() as 'en' | 'vi';
    const createDeliveryInfoSchema = deliveryInfoSchema(locale);

    const [step, setStep] = useState(1);
    const [isStep1Complete, setIsStep1Complete] = useState(false);
    const [modalScope, modalAnimate] = useAnimate();
    const [showOverlay, setShowOverlay] = useState(false);
    const { updateCart } = useStore();
    const router = useRouter();

    // Delivery Form
    const deliveryForm = useForm<DeliveryInfoSchema>({
        resolver: zodResolver(createDeliveryInfoSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            country: '',
            phone: '',
        },
    });

    // Payment Form
    const paymentForm = useForm<PaymentFormData>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            paymentMethod: 'ewallet',
            ewalletProvider: 'momo',
            cardNumber: '',
            bankName: '',
        },
    });

    // Reset forms and state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            deliveryForm.reset();
            paymentForm.reset();
            setStep(1);
            setIsStep1Complete(false);
        }
    }, [isOpen, deliveryForm, paymentForm]);

    useEffect(() => {
        if (isOpen) {
            setShowOverlay(true);
            modalAnimate(modalScope.current, { transform: 'translateX(0%)' }, { duration: 0.5 });
        } else {
            modalAnimate(modalScope.current, { transform: 'translateX(100%)' }, { duration: 0.5 });
            setTimeout(() => setShowOverlay(false), 500);
        }
    }, [isOpen, modalAnimate, modalScope]);

    const handleOrderNow = async () => {
        const deliveryData = deliveryForm.getValues();
        const isValid = await deliveryForm.trigger();
        if (!isValid) {
            toast.error(t('fillAllOrderRequired'));
            return;
        }

        const userId = await getUserIdFromCookie();
        if (!userId) {
            toast.error(t('logInPlaceOrder'));
            return;
        }

        const response = await createOrder(userId, deliveryData);
        if (response.success) {
            toast(t('orderSuccess'));
            await updateCart();
            setIsOpen(false);
            router.push('/my-orders');
        } else {
            toast.error(response.message || t('orderFailed'));
        }
    };

    const handlePayNow = async () => {
        const isValid = await deliveryForm.trigger();
        if (!isValid) {
            toast.error(t('fillAllOrderRequired'));
            return;
        }
        setIsStep1Complete(true);
        setStep(2);
    };

    const handlePay = paymentForm.handleSubmit(async () => {
        const paymentData = paymentForm.getValues();
        const isValid = await paymentForm.trigger();
        if (!isValid) {
            toast.error(t('fillAllPayRequired'));
            return;
        }

        const deliveryData = deliveryForm.getValues();
        const userId = await getUserIdFromCookie();
        if (!userId) {
            toast.error(t('logInPlaceOrder'));
            return;
        }

        const response = await createOrder(userId, deliveryData);
        if (response.success) {
            toast(t('paySuccess'));
            await updateCart();
            setIsOpen(false);
            router.push('/my-orders');
        } else {
            toast.error(response.message || t('orderFailed'));
        }
    });

    const handleMoveToStep2 = async () => {
        const isValid = await deliveryForm.trigger();
        if (!isValid) {
            toast.error(t('fillAllOrderRequired'));
            return;
        }
        setStep(2);
    };

    const paymentMethodOptions = [
        { value: 'ewallet', label: t('eWallet') },
        { value: 'creditCard', label: t('creditCard') },
    ];

    const ewalletProviderOptions = [
        { value: 'momo', label: 'Momo' },
        { value: 'googlePay', label: 'Google Pay' },
        { value: 'zaloPay', label: 'Zalo Pay' },
    ];

    return (
        <>
            {/* Overlay */}
            {showOverlay && (
                <div
                    className={twMerge(
                        'fixed inset-0 top-0 left-0 w-full h-full bg-black/50 opacity-0 transition-opacity duration-500 z-20',
                        isOpen && 'opacity-100',
                    )}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Modal */}
            <div
                className={twMerge(
                    'fixed top-0 right-0 h-[100dvh] w-[760px] bg-white shadow-md z-30 transition-all duration-500',
                    !isOpen && 'translate-x-[100%]',
                )}
                ref={modalScope}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                        <div className="flex items-center justify-between p-4">
                            <h2 className="font-heading text-lg">{t('checkout')}</h2>
                            <div className="cursor-pointer" onClick={() => setIsOpen(false)}>
                                <HiOutlineXMark size={30} />
                            </div>
                        </div>
                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                className={twMerge(
                                    'flex-1 py-2 text-center',
                                    step === 1 ? 'border-b-[3px] border-indigo-400 font-semibold' : 'text-gray-500',
                                )}
                                onClick={() => setStep(1)}
                            >
                                {t('step')} 1: {t('deliveryInfo')} {isStep1Complete && '✓'}
                            </button>
                            <button
                                className={twMerge(
                                    'flex-1 py-2 text-center',
                                    step === 2 ? 'border-b-[3px] border-indigo-400 font-semibold' : 'text-gray-500',
                                )}
                                onClick={() => handleMoveToStep2()}
                                disabled={!isStep1Complete}
                            >
                                {t('step')} 2: {t('payment')}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-16">
                                {/* Delivery Form */}
                                <div>
                                    <h3 className="font-semibold mb-4 text-lg">{t('deliveryInformation')}</h3>
                                    <form className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <label>{t('firstName')}</label>
                                            <div className="relative bg-white border border-black rounded-lg">
                                                <input
                                                    {...deliveryForm.register('firstName')}
                                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                                    placeholder={t('firstNamePlaceholder')}
                                                />
                                            </div>
                                            {deliveryForm.formState.errors.firstName && (
                                                <p className="text-red-500 mt-1 text-sm">
                                                    {deliveryForm.formState.errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label>{t('lastName')}</label>
                                            <div className="relative bg-white border border-black rounded-lg">
                                                <input
                                                    {...deliveryForm.register('lastName')}
                                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                                    placeholder={t('lastNamePlaceholder')}
                                                />
                                            </div>
                                            {deliveryForm.formState.errors.lastName && (
                                                <p className="text-red-500 text-sm">
                                                    {deliveryForm.formState.errors.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label>{t('street')}</label>
                                            <div className="relative bg-white border border-black rounded-lg">
                                                <input
                                                    {...deliveryForm.register('street')}
                                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                                    placeholder={t('streetPlaceholder')}
                                                />
                                            </div>
                                            {deliveryForm.formState.errors.street && (
                                                <p className="text-red-500 text-sm">
                                                    {deliveryForm.formState.errors.street.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label>{t('city')}</label>
                                            <div className="relative bg-white border border-black rounded-lg">
                                                <input
                                                    {...deliveryForm.register('city')}
                                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                                    placeholder={t('cityPlaceholder')}
                                                />
                                            </div>
                                            {deliveryForm.formState.errors.city && (
                                                <p className="text-red-500 text-sm">
                                                    {deliveryForm.formState.errors.city.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label>{t('country')}</label>
                                            <div className="relative bg-white border border-black rounded-lg">
                                                <input
                                                    {...deliveryForm.register('country')}
                                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                                    placeholder={t('countryPlaceholder')}
                                                />
                                            </div>
                                            {deliveryForm.formState.errors.country && (
                                                <p className="text-red-500 text-sm">
                                                    {deliveryForm.formState.errors.country.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label>{t('phone')}</label>
                                            <div className="relative bg-white border border-black rounded-lg">
                                                <input
                                                    {...deliveryForm.register('phone')}
                                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                                    placeholder={t('phonePlaceholder')}
                                                />
                                            </div>
                                            {deliveryForm.formState.errors.phone && (
                                                <p className="text-red-500 text-sm">
                                                    {deliveryForm.formState.errors.phone.message}
                                                </p>
                                            )}
                                        </div>
                                    </form>
                                </div>
                                {/* Cart Totals */}
                                <div>
                                    <h3 className="font-semibold mb-4 text-lg">{t('orderSum')}</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>{t('subtotal')}:</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t('tax')}:</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>{t('total')}:</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    {!isStep1Complete && (
                                        <div className="mt-4 space-y-2">
                                            <button
                                                onClick={handleOrderNow}
                                                className="w-full py-2 bg-gradient-light text-black rounded font-semibold"
                                            >
                                                {t('orderNow')}
                                            </button>
                                            <button
                                                onClick={handlePayNow}
                                                className="w-full py-2 border-gradient text-black rounded font-semibold"
                                            >
                                                {t('payNow')}
                                            </button>
                                        </div>
                                    )}
                                    {isStep1Complete && (
                                        <div className="mt-4">
                                            <button
                                                onClick={handleMoveToStep2}
                                                className="w-full py-2 bg-gradient-light text-black rounded font-semibold"
                                            >
                                                {t('moveToStep2')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <h3 className="font-semibold mb-4 text-lg">{t('paymentInformation')}</h3>
                                <form onSubmit={handlePay} className="space-y-4">
                                    <SelectField
                                        label={t('paymentMethod')}
                                        name="paymentMethod"
                                        options={paymentMethodOptions}
                                        control={paymentForm.control}
                                        error={paymentForm.formState.errors.paymentMethod}
                                    />
                                    {paymentForm.watch('paymentMethod') === 'ewallet' && (
                                        <SelectField
                                            label={t('eWalletProvider')}
                                            name="ewalletProvider"
                                            options={ewalletProviderOptions}
                                            control={paymentForm.control}
                                            error={paymentForm.formState.errors.ewalletProvider}
                                        />
                                    )}
                                    {paymentForm.watch('paymentMethod') === 'creditCard' && (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <label>{t('cardNumber')}</label>
                                                <div className="relative bg-white border border-black rounded-lg">
                                                    <input
                                                        {...paymentForm.register('cardNumber')}
                                                        className="w-full px-4 py-2 rounded-lg outline-none"
                                                        placeholder={t('cardNumberPlaceholder')}
                                                    />
                                                </div>
                                                {paymentForm.formState.errors.cardNumber && (
                                                    <p className="text-red-500 text-sm">
                                                        {paymentForm.formState.errors.cardNumber.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label>{t('bankName')}</label>
                                                <div className="relative bg-white border border-black rounded-lg">
                                                    <input
                                                        {...paymentForm.register('bankName')}
                                                        className="w-full px-4 py-2 rounded-lg outline-none"
                                                        placeholder={t('bankNamePlaceholder')}
                                                    />
                                                </div>
                                                {paymentForm.formState.errors.bankName && (
                                                    <p className="text-red-500 text-sm">
                                                        {paymentForm.formState.errors.bankName.message}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-gradient-medium text-black rounded font-semibold"
                                    >
                                        {t('pay')}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
