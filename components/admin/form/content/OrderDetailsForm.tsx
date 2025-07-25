'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';

// Define type for the order data
type OrderData = {
    product?: {
        name: string;
        price: number;
        images: { url: string }[];
    };
    quantity?: number;
    status?: {
        name: string;
    };
    deliveryInfo?: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        country: string;
        phone: string;
    }[];
};

export default function OrderDetailsForm({
    data,
    setOpen,
}: {
    type?: 'details';
    data?: OrderData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: OrderData[];
}) {
    const t = useTranslations('OrderDetailsForm');

    const [tab, setTab] = useState('productInfo');

    return (
        <div className="flex flex-col gap-8 max-h-[500px] overflow-y-auto hide-scrollbar">
            <h1 className="text-lg font-heading font-semibold">{t('title')}</h1>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setTab('productInfo')}
                    className={twMerge(
                        'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                        tab === 'productInfo' && 'bg-gradient-lighter font-semibold',
                    )}
                >
                    {t('productInfo')}
                </button>
                <button
                    type="button"
                    onClick={() => setTab('deliveryInfo')}
                    className={twMerge(
                        'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                        tab === 'deliveryInfo' && 'bg-gradient-lighter font-semibold',
                    )}
                >
                    {t('deliveryInfo')}
                </button>
            </div>
            {tab === 'productInfo' && (
                <>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">{t('productName')}</h2>
                            <p className="max-w-[420px] line-clamp-2 text-right">{data?.product?.name || '-'}</p>
                        </div>
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">{t('price')}</h2>
                            <p>{data?.product?.price ? `$${data.product.price.toFixed(2)}` : '-'}</p>
                        </div>
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">{t('quantity')}</h2>
                            <p>{data?.quantity || '-'}</p>
                        </div>
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">{t('status')}</h2>
                            <p>{data?.status?.name || '-'}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-medium text-lg">{t('images')}</h2>
                        <div className="flex justify-center flex-wrap gap-2 pt-4">
                            {(data?.product?.images?.length ?? 0) > 0 ? (
                                data?.product?.images.map((img: { url: string }, index: number) => (
                                    <Image
                                        key={index}
                                        src={img.url}
                                        alt={`Product image ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-md border-black border"
                                    />
                                ))
                            ) : (
                                <p>{t('noImagesAvailable')}</p>
                            )}
                        </div>
                    </div>
                </>
            )}
            {tab === 'deliveryInfo' && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center text-base justify-between">
                        <label className="font-medium">{t('firstName')}</label>
                        <p>{data?.deliveryInfo?.[0]?.firstName || '-'}</p>
                    </div>
                    <div className="flex items-center text-base justify-between">
                        <label className="font-medium">{t('lastName')}</label>
                        <p>{data?.deliveryInfo?.[0]?.lastName || '-'}</p>
                    </div>
                    <div className="flex items-center text-base justify-between">
                        <label className="font-medium">{t('street')}</label>
                        <p>{data?.deliveryInfo?.[0]?.street || '-'}</p>
                    </div>
                    <div className="flex items-center text-base justify-between">
                        <label className="font-medium">{t('city')}</label>
                        <p>{data?.deliveryInfo?.[0]?.city || '-'}</p>
                    </div>
                    <div className="flex items-center text-base justify-between">
                        <label className="font-medium">{t('country')}</label>
                        <p>{data?.deliveryInfo?.[0]?.country || '-'}</p>
                    </div>
                    <div className="flex items-center text-base justify-between">
                        <label className="font-medium">{t('phone')}</label>
                        <p>{data?.deliveryInfo?.[0]?.phone || '-'}</p>
                    </div>
                </div>
            )}
            <button type="button" onClick={() => setOpen(false)} className="bg-gray-200 p-2 rounded-md">
                {t('close')}
            </button>
        </div>
    );
}
