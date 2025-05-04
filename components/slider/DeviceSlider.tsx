'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import DeviceSliderBtn from './DeviceSliderBtn';
import { useRef } from 'react';
import { Link } from '@/navigation';

interface DeviceSliderProps {
    data: {
        id: string;
        title: string;
        price: number;
        img: string;
        href: string;
    }[];
}

export default function DeviceSlider({ data }: DeviceSliderProps) {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <>
            <Swiper
                modules={[Navigation]}
                slidesPerView={5}
                spaceBetween={10}
                slidesPerGroup={5}
                speed={700}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={() => console.log('slide change')}
            >
                {data.map(({ id, title, price, img, href }) => (
                    <SwiperSlide key={id}>
                        <Link
                            href={href}
                            className="flex h-full w-full flex-col items-center justify-center rounded-xl border bg-white group/device-popular transition-all duration-300"
                        >
                            <div className="block w-full px-2 py-4 xs:px-3 sm:py-5">
                                <div className="relative pb-[75%]">
                                    <div className="absolute left-0 top-1/2 h-3/4 w-full -translate-y-1/2">
                                        <div>
                                            <Image
                                                src={img}
                                                alt={title}
                                                width={200}
                                                height={200}
                                                sizes="100vw"
                                                className="object-contain group-hover/device-popular:scale-95 transition-all duration-300"
                                                style={{
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    inset: '0px',
                                                    color: 'transparent',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="two-line-ellipsis text-center font-heading text-xs font-bold text-gray-700 xxs:text-sm">
                                    {title}
                                </h3>
                                <div className="text-center text-xs text-gray-700">${price}</div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <DeviceSliderBtn swiperRef={swiperRef} />
        </>
    );
}
