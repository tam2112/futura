// PopularDevices.tsx
'use client';

import DeviceSlider from '@/components/slider/DeviceSlider';
import { useProductStore } from '@/store/productStore';
import { useEffect, useState } from 'react';

const popularDeviceTypes = [
    { id: 1, name: 'New Arrivals' },
    { id: 2, name: 'Popular iPhones' },
    { id: 3, name: 'Popular Laptops' },
    { id: 4, name: 'Trending iPads' },
];

export default function PopularDevices() {
    const [activeTab, setActiveTab] = useState<string>('New Arrivals');
    const {
        newArrivals,
        popularIPhones,
        popularLaptops,
        trendingIPads,
        fetchNewArrivals,
        fetchPopularIPhones,
        fetchPopularLaptops,
        fetchTrendingIPads,
    } = useProductStore();

    // Fetch all product data on component mount
    useEffect(() => {
        fetchNewArrivals();
        fetchPopularIPhones();
        fetchPopularLaptops();
        fetchTrendingIPads();
    }, [fetchNewArrivals, fetchPopularIPhones, fetchPopularLaptops, fetchTrendingIPads]);

    const getDeviceData = () => {
        switch (activeTab) {
            case 'New Arrivals':
                return newArrivals.map((product) => ({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    img: product.images[0]?.url || '/placeholder.png', // Fallback image
                    href: `/collections/details/${product.slug}`,
                }));
            case 'Popular iPhones':
                return popularIPhones.map((product) => ({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    img: product.images[0]?.url || '/placeholder.png',
                    href: `/collections/details/${product.slug}`,
                }));
            case 'Popular Laptops':
                return popularLaptops.map((product) => ({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    img: product.images[0]?.url || '/placeholder.png',
                    href: `/collections/details/${product.slug}`,
                }));
            case 'Trending iPads':
                return trendingIPads.map((product) => ({
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
        <div className="bg-light-gray py-8">
            <div className="container">
                {/* Heading */}
                <div className="hide-scrollbar flex w-full flex-col items-start justify-start gap-4 text-gray-700 md:justify-between">
                    <div className="flex w-full justify-between">
                        <h2 className="flex shrink-0 items-center text-lg font-bold font-heading md:text-xl">
                            Most Popular Devices
                        </h2>
                    </div>
                    <div className="flex w-full flex-row justify-between">
                        <div className="hide-scrollbar flex w-fit items-center gap-2 overflow-x-scroll font-extrabold">
                            {popularDeviceTypes.map(({ id, name }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className={`h-8 whitespace-nowrap rounded-full px-5 text-xs transition duration-150 ease-in-out ${
                                        activeTab === name ? 'bg-gradient-light' : 'bg-white'
                                    }`}
                                    onClick={() => setActiveTab(name)}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="relative mt-3 sm:mt-4 md:mt-5">
                    <div>
                        <DeviceSlider key={activeTab} data={getDeviceData()} />
                    </div>
                </div>
            </div>
        </div>
    );
}
