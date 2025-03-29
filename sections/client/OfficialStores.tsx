'use client';

import { acerDevicesData, brand, dellDevicesData, lenovoDevicesData, sonyDevicesData } from '@/temp/officialStoreData';
import Image from 'next/image';
import { RiArrowRightSLine } from 'react-icons/ri';

import checkImg from '@/public/official-store/check.svg?url';
import sonyImg from '@/public/official-store/sony.png';
import { useState } from 'react';
import DevicesBrand from '@/components/DevicesBrand';

export default function OfficialStores() {
    const [activeTab, setActiveTab] = useState<string>('Sony');

    const getDeviceData = () => {
        switch (activeTab) {
            case 'Sony':
                return sonyDevicesData;
            case 'Dell':
                return dellDevicesData;
            case 'Lenovo':
                return lenovoDevicesData;
            case 'Acer':
                return acerDevicesData;
            default:
                return sonyDevicesData;
        }
    };

    return (
        <div className="py-8 bg-light-gray">
            <div className="container">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center text-lg font-bold font-heading md:text-xl">Official Stores</h2>
                </div>
                {/* heading */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="hide-scrollbar flex w-fit items-center gap-2 overflow-hidden overflow-x-scroll font-extrabold">
                        {brand.map(({ id, title }) => (
                            <button
                                key={id}
                                className={`h-8 whitespace-nowrap rounded-full px-5 text-xs transition duration-150 ease-in-out ${
                                    activeTab === title ? 'bg-gradient-light' : 'bg-white'
                                }`}
                                onClick={() => setActiveTab(title)}
                            >
                                {title}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center hover:underline lg:flex">
                        <div className="-mt-0.5 mr-1.5 h-4 w-4">
                            <Image src={checkImg} alt="check" width={27} height={26} className="size-full" />
                        </div>
                        <p className="text-sm font-extrabold">Visit Sony store</p>
                        <div className="ml-3 w-3">
                            <RiArrowRightSLine size={20} />
                        </div>
                    </div>
                </div>
                {/* content */}
                <div className="mt-5 grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
                    <div className="h-[300px] w-full lg:order-1 lg:min-h-[550px]">
                        <Image
                            src={sonyImg}
                            alt="sony"
                            width={1260}
                            height={110}
                            className="h-full w-full rounded-md object-cover"
                        />
                    </div>
                    <DevicesBrand data={getDeviceData()} />
                </div>
            </div>
        </div>
    );
}
