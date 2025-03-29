'use client';

import PriceRange from '@/components/client/PriceRange';
import {
    allFilters,
    batteryHealthFilter,
    brandFilter,
    categoryFilter,
    colorFilter,
    connectivityFilter,
    latestRelease,
    listProducts,
    ramFilter,
    simSlotFilter,
    storageFilter,
} from '@/temp/collectionsData';
import { useAnimate } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { SlArrowDown } from 'react-icons/sl';
import Pagination from './Pagination';

type FilterDataMap = {
    Brand: { id: number; name: string }[];
    Color: { id: number; name: string }[];
    Storage: { id: number; title: string }[];
    Connectivity: { id: number; title: string }[];
    'Sim slot': { id: number; title: string }[];
    'Battery Health': { id: number; number: number }[];
    Ram: { id: number; title: string }[];
};

export default function Category() {
    const [priceRange, setPriceRange] = useState([0, 2010]);
    const [filterScope, filterAnimate] = useAnimate();
    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const filterRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Object ánh xạ giữa tên filter và dữ liệu tương ứng
    const filterDataMap: FilterDataMap = {
        Brand: brandFilter,
        Color: colorFilter,
        Storage: storageFilter,
        Connectivity: connectivityFilter,
        'Sim slot': simSlotFilter,
        'Battery Health': batteryHealthFilter,
        Ram: ramFilter,
    };

    const handleFilterClick = (filterName: string) => {
        setOpenFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName], // Đảo ngược trạng thái hiện tại
        }));
    };

    useEffect(() => {
        Object.entries(openFilters).forEach(([filterName, isOpen]) => {
            const filterElement = filterRefs.current[filterName];
            if (filterElement) {
                filterAnimate(
                    filterElement,
                    {
                        maxHeight: isOpen ? '288px' : '0px',
                    },
                    {
                        duration: 0.1,
                    },
                );
            }
        });
    }, [openFilters, filterAnimate]);

    const handlePriceRangeChange = (newValues: number[]) => {
        setPriceRange(newValues);
    };

    return (
        <div>
            <div className="container pb-8">
                <div className="mt-5 grid grid-cols-12 gap-x-5">
                    {/* attribute */}
                    <section className="col-span-4 hidden h-fit rounded-md border lg:block xl:col-span-3">
                        <div className="group grid divide-y">
                            <div className="px-4 pt-4">
                                <div>
                                    <h2 className="mb-2 text-base font-bold capitalize text-gray-700 xs:mb-3 lg:text-sm lg:uppercase">
                                        Price range
                                    </h2>
                                    <div className="price-span grid grid-cols-2 gap-2">
                                        <input
                                            className="rounded bg-gray-200 py-2 px-3 text-base text-gray-700 xs:py-3.5 xl:text-sm outline-none"
                                            value={priceRange[0]}
                                            readOnly
                                        />
                                        <input
                                            className="rounded bg-gray-200 py-2 px-3 text-base text-gray-700 xs:py-3.5 xl:text-sm outline-none"
                                            value={priceRange[1]}
                                            readOnly
                                        />
                                    </div>
                                    <div className="py-[30px]">
                                        <PriceRange onPriceRangeChange={handlePriceRangeChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y">
                                {allFilters.map((filter) => (
                                    <div key={filter.id} className="bg-white">
                                        <div
                                            className="cursor-pointer mb-3 flex items-center justify-between px-4 pt-4"
                                            onClick={() => handleFilterClick(filter.name)}
                                        >
                                            <h3 className="flex w-full cursor-pointer items-center gap-2 text-sm font-bold uppercase text-gray-700">
                                                <div>
                                                    <div className="h-[2px] w-[10px] bg-gray-700"></div>
                                                    <div className="mx-auto -mt-[6px] h-[10px] w-[2px] bg-gray-700 transition-all duration-150 ease-in-out"></div>
                                                </div>
                                                {filter.name}
                                            </h3>
                                        </div>
                                        <div
                                            className="overflow-auto transition-all duration-300 ease-in-out px-4 max-h-0"
                                            ref={(el) => {
                                                filterRefs.current[filter.name] = el;
                                            }}
                                        >
                                            {filter.name in filterDataMap &&
                                                filterDataMap[filter.name as keyof FilterDataMap]?.map((item) => (
                                                    <label
                                                        key={item.id}
                                                        className="mb-2 block cursor-pointer text-sm text-gray-700"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="peer relative top-[2px] mr-2 h-[15px] w-[15px] accent-gray-700"
                                                        />
                                                        <span className="peer-disabled:opacity-70">
                                                            {'name' in item
                                                                ? item.name
                                                                : 'title' in item
                                                                ? item.title
                                                                : item.number}
                                                        </span>
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    {/* list product */}
                    <section className="col-span-12 gap-x-5 lg:col-span-8 xl:col-span-9">
                        {/* filter */}
                        <div className="grid grid-cols-12 gap-y-2.5 gap-x-5">
                            <div className="order-2 col-span-12 lg:order-1 lg:col-span-9">
                                <div className="hide-scrollbar flex flex-nowrap gap-1 overflow-hidden overflow-x-scroll">
                                    {categoryFilter.map(({ id, name }) => (
                                        <button
                                            key={id}
                                            className="flex h-10 shrink-0 items-center justify-center rounded-md border px-3 text-sm outline-none transition duration-300 ease-in-out disabled:opacity-40 hover:cursor-pointer hover:bg-gradient-light"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="order-1 col-span-12 mr-[-2px] grid h-10 grid-cols-2 divide-x rounded-md border text-sm lg:order-2 lg:col-span-3 lg:grid-cols-1 lg:divide-x-0">
                                <button className="flex items-center justify-center gap-x-3 disabled:opacity-40 lg:hidden hover:underline hover:underline-offset-2">
                                    Filters
                                    <div className="h-4 w-4">
                                        <CiFilter size={50} />
                                    </div>
                                </button>
                                <div className="relative z-20 opacity-100 group">
                                    <button className="flex h-full w-full items-center justify-center gap-x-3 px-3 lg:justify-between">
                                        <span className="block truncate">Latest Release</span>
                                        <span>
                                            <div className="relative h-[6px] w-[12px] xs:h-[7px] xs:w-[14px]">
                                                <SlArrowDown
                                                    width={10}
                                                    height={5}
                                                    className="group-hover:rotate-180 transition-transform duration-500"
                                                />
                                            </div>
                                        </span>
                                    </button>
                                    <ul
                                        className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 w-full rounded border bg-white transition-all duration-500"
                                        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 15px 20px -10px' }}
                                    >
                                        {latestRelease.map(({ id, title }) => (
                                            <button
                                                key={id}
                                                className="group relative w-full py-2 text-left hover:underline"
                                            >
                                                <span className="absolute inline-block h-[6px] w-[6px] -translate-y-1/2 rounded-full ring-gray-700 ring-offset-white xs:h-2 xs:w-2 left-4 top-1/2 border-none bg-white ring-[1px] ring-offset-[1.5px]"></span>
                                                <span className="ml-9 block truncate font-normal">{title}</span>
                                            </button>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* list */}
                        <div className="mt-2.5 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:!grid-cols-4">
                            {listProducts.map(({ id, img, title, price, subPrice }) => (
                                <div
                                    key={id}
                                    className="mr-[-1px] mb-[-1px] flex flex-col border border-gray-100 bg-white px-2 pt-5 pb-3 xs:px-4 xs:pt-7 xs:pb-3"
                                >
                                    <div className="flex h-full w-full flex-col items-center justify-start text-gray-700">
                                        <div className="relative mt-auto w-full">
                                            <div>
                                                <Image
                                                    src={img}
                                                    alt={`${title}-${id}`}
                                                    width={280}
                                                    height={120}
                                                    className="h-[18vw] object-contain xs:h-[13vw] sm:h-[10vw] lg:h-[7vw] xl:h-[95px]"
                                                />
                                            </div>
                                        </div>
                                        <h4 className="two-line-ellipsis pt-5 text-center text-xs font-semibold !leading-4 xs:pt-6 sm:text-sm">
                                            {title}
                                        </h4>
                                        <div className="mt-1 text-center text-xs sm:text-sm">
                                            From
                                            <span className="ml-1">
                                                ${price}
                                                <sup style={{ top: '-0.4em' }}>.{subPrice}</sup>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* pagination */}
                        <div>
                            <Pagination />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
