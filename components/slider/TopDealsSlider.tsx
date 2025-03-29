'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';

import { topDealsData } from '@/temp/topDealsData';
import Image from 'next/image';
import DeviceSliderBtn from './DeviceSliderBtn';
import { useRef } from 'react';

export default function TopDealsSlider() {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <>
            <Swiper
                modules={[Navigation]}
                slidesPerView={3}
                spaceBetween={10}
                slidesPerGroup={3}
                speed={700}
                effect="cube"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    console.log(swiper);
                }}
                onSlideChange={() => console.log('slide change')}
                className="!py-4 !pr-4 lg:!pl-0"
            >
                {topDealsData.map(({ id, order, title, off, isDeal, price, img }) => (
                    <SwiperSlide key={id}>
                        <div className="flex h-full w-full cursor-pointer flex-col rounded-xl bg-white p-4">
                            {/* order */}
                            <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-4 border-gray-200 bg-gradient-light text-xs text-cover-deals">
                                #<span className="ml-[1px] font-heading font-bold">{order}</span>
                            </div>
                            {/* img */}
                            <div className="mt-2">
                                <div className="flex items-center justify-center">
                                    <div className="size-24">
                                        <Image
                                            src={img}
                                            alt={title}
                                            width={100}
                                            height={100}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 flex h-6 items-center gap-2 text-xs">
                                    {off && (
                                        <div className="flex h-6 items-center justify-center rounded-sm bg-gradient px-2 text-[11px] font-extrabold text-white">
                                            {off} off
                                        </div>
                                    )}
                                    {isDeal && <span className="font-extrabold text-red">Deal</span>}
                                </div>
                            </div>
                            {/* content */}
                            <div className="mt-3 flex flex-1 flex-col justify-between">
                                <h3 className="two-line-ellipsis text-sm">{title}</h3>
                                <h4 className="mt-5 text-sm font-extrabold">${price}</h4>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <DeviceSliderBtn swiperRef={swiperRef} />
        </>
    );
}
