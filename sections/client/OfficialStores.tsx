'use client';

import Image from 'next/image';
import sonyImg from '@/public/official-store/sony.png';
import lenovoImg from '@/public/official-store/lenovo.webp';
import acerImg from '@/public/official-store/acer.webp';
import dellImg from '@/public/official-store/dell.webp';
import { useState, useEffect } from 'react';
import DevicesBrand from '@/components/DevicesBrand';
import { useProductStore } from '@/store/productStore';
import { useTranslations } from 'next-intl';

const brands = [
    { id: 1, title: 'Sony' },
    { id: 2, title: 'Dell' },
    { id: 3, title: 'Lenovo' },
    { id: 4, title: 'Acer' },
];

export default function OfficialStores() {
    const t = useTranslations('OfficialStores');

    const [activeTab, setActiveTab] = useState<string>('Sony');
    const {
        sonyProducts,
        dellProducts,
        lenovoProducts,
        acerProducts,
        fetchSonyProducts,
        fetchDellProducts,
        fetchLenovoProducts,
        fetchAcerProducts,
    } = useProductStore();

    // Fetch all brand products on mount
    useEffect(() => {
        fetchSonyProducts();
        fetchDellProducts();
        fetchLenovoProducts();
        fetchAcerProducts();
    }, [fetchSonyProducts, fetchDellProducts, fetchLenovoProducts, fetchAcerProducts]);

    const getDeviceData = () => {
        switch (activeTab) {
            case 'Sony':
                return sonyProducts.map((product) => ({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    img: product.images[0]?.url || '/placeholder.png',
                    href: `/collections/details/${product.slug}`,
                }));
            case 'Dell':
                return dellProducts.map((product) => ({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    img: product.images[0]?.url || '/placeholder.png',
                    href: `/collections/details/${product.slug}`,
                }));
            case 'Lenovo':
                return lenovoProducts.map((product) => ({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    img: product.images[0]?.url || '/placeholder.png',
                    href: `/collections/details/${product.slug}`,
                }));
            case 'Acer':
                return acerProducts.map((product) => ({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    img: product.images[0]?.url || '/placeholder.png',
                    href: `/collections/details/${product.slug}`,
                }));
            default:
                return [];
        }
    };

    return (
        <div className="py-8 bg-light-gray">
            <div className="container">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center text-lg font-bold font-heading md:text-xl">{t('title')}</h2>
                </div>
                {/* Heading */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="hide-scrollbar flex w-fit items-center gap-2 overflow-hidden overflow-x-scroll font-extrabold">
                        {brands.map(({ id, title }) => (
                            <button
                                key={id}
                                className={`h-8 whitespace-nowrap rounded-full px-5 text-xs transition duration-150 ease-in-out hover:bg-gradient-light ${
                                    activeTab === title ? 'bg-gradient-light' : 'bg-white'
                                }`}
                                onClick={() => setActiveTab(title)}
                            >
                                {title}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Content */}
                <div className="mt-5 grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
                    {activeTab === 'Sony' ? (
                        <div className="h-[300px] w-full lg:order-1 lg:min-h-[550px]">
                            <Image
                                src={sonyImg}
                                alt="sony"
                                width={1260}
                                height={110}
                                className="h-full w-full rounded-md object-cover"
                            />
                        </div>
                    ) : activeTab === 'Lenovo' ? (
                        <div className="h-[300px] w-full lg:order-1 lg:min-h-[550px]">
                            <Image
                                src={lenovoImg}
                                alt="lenovo"
                                width={1260}
                                height={110}
                                className="h-full w-full rounded-md object-cover"
                            />
                        </div>
                    ) : activeTab === 'Acer' ? (
                        <div className="h-[300px] w-full lg:order-1 lg:min-h-[550px]">
                            <Image
                                src={acerImg}
                                alt="acer"
                                width={1260}
                                height={110}
                                className="h-full w-full rounded-md object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-[300px] w-full lg:order-1 lg:min-h-[550px]">
                            <Image
                                src={dellImg}
                                alt="dell"
                                width={1260}
                                height={110}
                                className="h-full w-full rounded-md object-cover"
                            />
                        </div>
                    )}
                    <DevicesBrand data={getDeviceData()} />
                </div>
            </div>
        </div>
    );
}
