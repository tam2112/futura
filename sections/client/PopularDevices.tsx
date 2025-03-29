'use client';

import Button from '@/components/Button';
import DeviceSlider from '@/components/slider/DeviceSlider';
import {
    newArrivalsData,
    popularDeviceTypesData,
    popularIPhonesData,
    popularOtherPhonesData,
    trendingIPadsData,
} from '@/temp/deviceData';
import { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

export default function PopularDevices() {
    const [activeTab, setActiveTab] = useState<string>('New Arrivals');

    const getDeviceData = () => {
        switch (activeTab) {
            case 'New Arrivals':
                return newArrivalsData;
            case 'Popular iPhones':
                return popularIPhonesData;
            case 'Popular Other Phones':
                return popularOtherPhonesData;
            case 'Trending iPads':
                return trendingIPadsData;
            default:
                return newArrivalsData;
        }
    };

    return (
        <div className="bg-light-gray py-8">
            <div className="container">
                {/* heading */}
                <div className="hide-scrollbar flex w-full flex-col items-start justify-start gap-4 text-gray-700 md:justify-between">
                    <div className="flex w-full justify-between">
                        <h2 className="flex shrink-0 items-center text-lg font-bold font-heading md:text-xl">
                            Most Popular Devices
                        </h2>
                    </div>
                    <div className="flex w-full flex-row justify-between">
                        <div className="hide-scrollbar flex w-fit items-center gap-2 overflow-x-scroll font-extrabold">
                            {popularDeviceTypesData.map(({ id, name }) => (
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
                        <div className="hidden items-center gap-2 lg:flex">
                            <div className="relative">
                                <Button variant="text" className="text-sm font-extrabold after:left-0">
                                    See all {activeTab}
                                </Button>
                            </div>
                            <div className="w-3 lg:block">
                                <RiArrowRightSLine size={20} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* content */}
                <div className="relative mt-3 sm:mt-4 md:mt-5">
                    <div>
                        <DeviceSlider key={activeTab} data={getDeviceData()} />
                    </div>
                </div>
            </div>
        </div>
    );
}
