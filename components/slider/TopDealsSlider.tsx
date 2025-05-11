'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import DeviceSliderBtn from './DeviceSliderBtn';
import { useEffect, useRef } from 'react';
import { useProductStore } from '@/store/productStore';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function TopDealsSlider() {
    const t = useTranslations('TopDeals');

    const swiperRef = useRef<SwiperType | null>(null);
    const { dealProducts, fetchDealProducts } = useProductStore();

    // Fetch 6 deal products on mount
    useEffect(() => {
        fetchDealProducts(6);
    }, [fetchDealProducts]);

    return (
        <>
            <Swiper
                modules={[Navigation]}
                slidesPerView={3}
                spaceBetween={10}
                slidesPerGroup={3}
                speed={700}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                className="!py-4 !pr-4 lg:!pl-0"
            >
                {dealProducts.map(({ id, name, price, priceWithDiscount, images, promotions, slug }, index) => (
                    <SwiperSlide key={id}>
                        <Link href={`/collections/details/${slug}`}>
                            <div className="flex h-full w-full cursor-pointer flex-col rounded-xl bg-white p-4 group/top-deal">
                                {/* Order */}
                                <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-4 border-gray-200 bg-gradient-light text-xs text-cover-deals">
                                    #<span className="ml-[1px] font-heading font-bold">{index + 1}</span>
                                </div>
                                {/* Image */}
                                <div className="mt-2">
                                    <div className="flex items-center justify-center">
                                        <div className="size-24">
                                            <Image
                                                src={images[0]?.url || '/placeholder.png'}
                                                alt={name}
                                                width={100}
                                                height={100}
                                                className="h-full w-full object-contain group-hover/top-deal:scale-105 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex h-6 items-center gap-2 text-xs">
                                        {promotions?.[0]?.percentageNumber && (
                                            <div className="flex h-6 items-center justify-center rounded-sm bg-rose-500 px-2 text-[11px] font-extrabold text-white">
                                                {promotions[0].percentageNumber}% {t('off')}
                                            </div>
                                        )}
                                        <span className="font-extrabold text-rose-500">{t('deal')}</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="mt-3 flex flex-1 flex-col justify-between">
                                    <h3 className="two-line-ellipsis text-sm">{name}</h3>
                                    <div className="flex items-center gap-2">
                                        {/* Original price (strikethrough) */}
                                        <h4 className="mt-5 text-sm line-through font-light">${price.toFixed(2)}</h4>
                                        {/* Discounted price */}
                                        <h4 className="mt-5 text-sm font-extrabold">
                                            ${priceWithDiscount?.toFixed(2)}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <DeviceSliderBtn swiperRef={swiperRef} />
        </>
    );
}
