/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { categoryTechnicalMap } from '@/constants/categoryTechnicalMap';

export default function ProductDetailsForm({
    data,
    setOpen,
    relatedData,
}: {
    type?: 'details';
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) {
    const [tab, setTab] = useState('main');

    const selectedCategory = relatedData?.categories
        ?.find((category: { id: string }) => category.id === data?.categoryId)
        ?.name.toLowerCase();

    const shouldShowTechnical = (technical: string) => {
        if (!selectedCategory) return false;
        return categoryTechnicalMap[selectedCategory]?.includes(technical);
    };

    const getRelatedDataName = (id: string, key: string) => {
        const item = relatedData[key]?.find((item: { id: string }) => item.id === id);
        return item ? item.name || item.title || `${item.name} - ${item.hex}` : '-';
    };

    return (
        <div className="flex flex-col gap-8 max-h-[500px] overflow-y-auto hide-scrollbar">
            <h1 className="text-lg font-heading font-semibold">Product Details</h1>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setTab('main')}
                    className={twMerge(
                        'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                        tab === 'main' && 'bg-gradient-lighter font-semibold',
                    )}
                >
                    Main
                </button>
                <button
                    type="button"
                    onClick={() => setTab('technical')}
                    className={twMerge(
                        'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                        tab === 'technical' && 'bg-gradient-lighter font-semibold',
                    )}
                >
                    Technical
                </button>
            </div>
            {tab === 'main' && (
                <>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">Product name</h2>
                            <p>{data?.name || '-'}</p>
                        </div>
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">Price</h2>
                            <p>{data?.price ? `$${data.price}` : '-'}</p>
                        </div>
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">Quantity</h2>
                            <p>{data?.quantity ? `$${data.quantity}` : '-'}</p>
                        </div>
                        <div className="flex items-center text-base justify-between">
                            <h2 className="font-medium">Category</h2>
                            <p>{getRelatedDataName(data?.categoryId, 'categories')}</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-3 text-base">
                            <h2 className="font-medium">Description</h2>
                            <p className="max-w-[420px] line-clamp-2">{data?.description || '-'}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-medium text-lg">Images</h2>
                        <div className="flex justify-center flex-wrap gap-2 pt-4">
                            {data?.images?.length > 0 ? (
                                data.images.map((img: { url: string }, index: number) => (
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
                                <p>No images available</p>
                            )}
                        </div>
                    </div>
                </>
            )}
            {tab === 'technical' && (
                <div className="flex flex-col gap-3">
                    {shouldShowTechnical('brand') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Brand</label>
                            <p>{getRelatedDataName(data?.brandId, 'brands')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('color') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Color</label>
                            <p>{getRelatedDataName(data?.colorId, 'colors')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('storage') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Storage</label>
                            <p>{getRelatedDataName(data?.storageId, 'storages')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('connectivity') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Connectivity</label>
                            <p>{getRelatedDataName(data?.connectivityId, 'connectivities')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('simSlot') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Sim Slot</label>
                            <p>{getRelatedDataName(data?.simSlotId, 'simSlots')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('batteryHealth') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Battery Health</label>
                            <p>{getRelatedDataName(data?.batteryHealthId, 'batteryHealths')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('ram') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">RAM</label>
                            <p>{getRelatedDataName(data?.ramId, 'rams')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('cpu') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">CPU</label>
                            <p>{getRelatedDataName(data?.cpuId, 'cpus')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('screenSize') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Screen Size</label>
                            <p>{getRelatedDataName(data?.screenSizeId, 'screenSizes')}</p>
                        </div>
                    )}
                    {shouldShowTechnical('type') && (
                        <div className="flex items-center text-base justify-between">
                            <label className="font-medium">Type</label>
                            <p>{getRelatedDataName(data?.typeId, 'types')}</p>
                        </div>
                    )}
                </div>
            )}
            <button type="button" onClick={() => setOpen(false)} className="bg-gray-200 p-2 rounded-md">
                Close
            </button>
        </div>
    );
}
