'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { useRef } from 'react';
import { featureHighlights } from '@/temp/highlightData';
import Image from 'next/image';

export default function FeatureHighlightSlider() {
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
            >
                {featureHighlights.map(({ id, img, title, desc }) => (
                    <SwiperSlide key={id}>
                        <div className="inline-block w-full">
                            <div className="flex flex-col flex-wrap items-center justify-items-start">
                                <div className="w-[24px]">
                                    <Image src={img} alt={title} width={24} height={24} />
                                </div>
                                <h3 className="mt-2 text-center text-xs font-heading font-bold bg-gradient bg-clip-text text-transparent sm:mt-3 lg:text-base xl:mt-4">
                                    {title}
                                </h3>
                                <div className="text-center text-xs text-gray-700 font-light lg:text-base">{desc}</div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
