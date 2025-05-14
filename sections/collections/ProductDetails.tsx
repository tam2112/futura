/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { LuLeaf } from 'react-icons/lu';
import { SlArrowLeft } from 'react-icons/sl';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRef, useState } from 'react';
import DeviceSliderBtn from '@/components/slider/DeviceSliderBtn';
import { useStore } from '@/context/StoreContext';
import { twMerge } from 'tailwind-merge';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { toggleFavourite } from '@/lib/actions/product.action';
import Cookies from 'js-cookie';

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    priceWithDiscount?: number;
    quantity: number;
    images: { url: string }[];
    brand?: { id: string; name: string };
    color?: { id: string; name: string; hex: string };
    storage?: { id: string; name: string };
    connectivity?: { id: string; name: string };
    simSlot?: { id: string; title: string };
    batteryHealth?: { id: string; title: string };
    ram?: { id: string; title: string };
    cpu?: { id: string; name: string };
    screenSize?: { id: string; name: string };
    type?: { id: string; name: string };
    category: { name: string; slug: string };
    status?: { id: string; name: string };
    promotions?: { percentageNumber: number }[];
    isFavourite: boolean;
};

type ProductDetailsProps = {
    product: Product;
    relatedProducts: Product[];
};

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
    const t = useTranslations('ProductDetails');
    const locale = useLocale() as 'en' | 'vi';
    const { isLoggedIn } = useAuth();

    const [selectedImage, setSelectedImage] = useState(product.images[0]?.url || '/placeholder.png');
    const [isFavourite, setIsFavourite] = useState(product.isFavourite);
    const swiperRef = useRef<SwiperType | null>(null);
    const { handleAddToCart } = useStore();
    const userId = Cookies.get('userId');

    const handleToggleFavourite = async () => {
        if (!isLoggedIn) {
            toast.error(t('notLoggedIn'));
            return;
        }

        if (!userId) {
            toast.error(t('notLoggedIn'));
            return;
        }

        const response = await toggleFavourite(
            { success: false, error: false },
            { productId: product.id, locale, userId },
        );

        if (response.success) {
            setIsFavourite(response.isFavourite ?? false);
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    };

    // Tạo breadcrumb động từ category
    const breadcrumbs = [
        { id: 1, title: t('home'), href: '/' },
        { id: 2, title: product.category.name, href: `/collections/list/${product.category.slug}` },
        { id: 3, title: product.name, href: '' },
    ];

    // Danh sách technical để hiển thị
    const technicals = [
        { key: 'Brand', title: t('brand'), value: product.brand?.name, display: product.brand?.name },
        {
            key: 'Color',
            title: t('color'),
            value: product.color?.id,
            display: product.color ? (
                <div className="flex items-center gap-2">
                    <span>{product.color.name}</span>
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: product.color.hex }}></div>
                </div>
            ) : null,
        },
        { key: 'Storage', title: t('storage'), value: product.storage?.name, display: product.storage?.name },
        { key: 'Sim Slot', title: t('simSlot'), value: product.simSlot?.title, display: product.simSlot?.title },
        {
            key: 'Connectivity',
            title: t('connectivity'),
            value: product.connectivity?.name,
            display: product.connectivity?.name,
        },
        {
            key: 'Battery Health',
            title: t('batteryHealth'),
            value: product.batteryHealth?.title,
            display: product.batteryHealth?.title,
        },
        { key: 'RAM', title: t('ram'), value: product.ram?.title, display: product.ram?.title },
        { key: 'CPU', title: t('cpu'), value: product.cpu?.name, display: product.cpu?.name },
        {
            key: 'Screen Size',
            title: t('screenSize'),
            value: product.screenSize?.name,
            display: product.screenSize?.name,
        },
        { key: 'Type', title: t('type'), value: product.type?.name, display: product.type?.name },
    ].filter((tech) => tech.value); // Chỉ hiển thị technical có dữ liệu

    return (
        <>
            <div className="bg-white pt-5 lg:pt-6">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="items-center gap-1 text-xs mb-2 hidden lg:flex">
                        {breadcrumbs.map(({ id, title, href }, index) => (
                            <div key={id} className="flex items-center gap-1">
                                {href ? (
                                    <Link
                                        href={href}
                                        className="underline underline-offset-1 transition text-gray-700/50 duration-150 ease-in-out hover:text-gray-700/100"
                                    >
                                        {title}
                                    </Link>
                                ) : (
                                    <span className="max-w-[300px] truncate text-gray-700/100">{title}</span>
                                )}
                                {index < breadcrumbs.length - 1 && <span className="text-gray-700/50">/</span>}
                            </div>
                        ))}
                    </div>
                    {/* Product */}
                    <div className="flex flex-col items-start lg:flex-row lg:gap-4">
                        {/* Image Section */}
                        <section className="w-full select-none rounded-md transition-all duration-200 ease-in-out lg:sticky lg:w-1/2 lg:top-[9rem]">
                            <div className="rounded-md border-gray-200 px-5 sm:px-8 lg:border lg:p-4">
                                {/* Heading */}
                                <div className="flex flex-wrap items-center justify-between lg:mb-10">
                                    {/* Mobile Breadcrumb */}
                                    <div className="flex w-full items-center justify-between truncate lg:hidden">
                                        <div className="flex items-center text-xs">
                                            <Link
                                                href={`/collections/list/${product.category.slug}`}
                                                className="flex items-center"
                                            >
                                                <SlArrowLeft className="h-4 w-4" />
                                                <span className="underline underline-offset-1 pl-2">
                                                    {product.category.name}
                                                </span>
                                            </Link>
                                        </div>
                                        <div className="text-sm lg:hidden">
                                            <span className="mr-2 text-xs">
                                                {t('already')} {product.quantity}
                                            </span>
                                            <span
                                                className={twMerge(
                                                    'text-xs p-2 rounded-lg',
                                                    product.status?.name === 'In stock' ? 'bg-teal-400' : 'bg-rose-400',
                                                )}
                                            >
                                                {t(`${product.status?.name}`)}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Desktop Info */}
                                    <div className="mr-3 hidden truncate lg:block">
                                        <div className="flex items-center gap-1.5 rounded-md bg-[#ECFCF5] px-3 py-1.5 text-xs text-[#1D6C49]">
                                            <LuLeaf size={15} />
                                            {t('sustainable')} <span className="hidden xs:inline-block">choice</span>
                                        </div>
                                    </div>
                                    <div className="hidden text-sm lg:block">
                                        <span className="mr-2 text-xs">
                                            {t('already')} {product.quantity}
                                        </span>
                                        <span
                                            className={twMerge(
                                                'text-xs p-2 rounded-lg text-white',
                                                product.status?.name === 'In stock' ? 'bg-teal-400' : 'bg-rose-400',
                                            )}
                                        >
                                            {t(`${product.status?.name}`)}
                                        </span>
                                    </div>
                                </div>
                                {/* Image Body */}
                                <div className="hidden lg:block">
                                    <div className="flex items-center">
                                        {/* Image Selection */}
                                        <div className="hidden flex-col items-center lg:flex">
                                            <div className="hide-scrollbar flex flex-col gap-3 overflow-y-auto max-h-[300px]">
                                                {product.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        className={`rounded-md border p-1.5 transition duration-150 ease-in-out ${
                                                            selectedImage === image.url
                                                                ? 'border-gray-700'
                                                                : 'border-gray-500 opacity-50 hover:opacity-100'
                                                        }`}
                                                        onClick={() => setSelectedImage(image.url)}
                                                    >
                                                        <div className="h-10 w-10">
                                                            <Image
                                                                src={image.url}
                                                                alt={`${product.name}-${index}`}
                                                                width={50}
                                                                height={50}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Image Selected */}
                                        <div className="relative mx-auto mb-3 flex h-48 w-48 items-center justify-center xs:mb-2 sm:h-72 sm:w-72 lg:mb-0 xl:h-80 xl:w-80">
                                            <Image
                                                src={selectedImage}
                                                alt={product.name}
                                                width={300}
                                                height={300}
                                                className="h-full min-h-full w-full min-w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Content Section */}
                        <section className="relative w-full px-5 py-2 sm:px-8 lg:w-1/2 lg:p-0">
                            <div className="relative z-20 mx-auto mt-1 w-full rounded bg-white px-0 sm:mt-2 lg:mt-0 lg:rounded-none lg:p-0">
                                <div className="mb-4 rounded-md border-gray-200 p-0 lg:border lg:p-4">
                                    <div className="flex items-center gap-3 lg:items-start">
                                        <div className="flex-1">
                                            <h1 className="flex-1 text-base font-extrabold leading-6 xs:text-lg lg:text-xl">
                                                {product.name}
                                            </h1>
                                        </div>
                                        {product.priceWithDiscount ? (
                                            <>
                                                <div className="mb-1 flex items-center justify-end">
                                                    <div className="text-xs text-slate-300">
                                                        <span className="line-through">{product.price.toFixed(2)}</span>
                                                    </div>
                                                    <div className="absolute right-[-39px] top-6 ml-2 hidden w-[40px] rounded-r-full bg-rose-600 pr-2 leading-3 lg:block">
                                                        <span className="flex items-center justify-center p-1 px-1.5 text-center text-xs font-bold text-white lg:p-1.5">
                                                            {product.promotions?.[0]?.percentageNumber}% {t('off')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end">
                                                    <h2 className="block text-xl font-bold leading-tight text-gray-700">
                                                        ${Math.floor(product.priceWithDiscount)}
                                                        <sup style={{ top: '-0.4em' }}>
                                                            .{(product.priceWithDiscount % 1).toFixed(2).slice(2)}
                                                        </sup>
                                                    </h2>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-end">
                                                <h2 className="block text-xl font-bold leading-tight text-gray-700">
                                                    ${Math.floor(product.price)}
                                                    <sup style={{ top: '-0.4em' }}>
                                                        .{(product.price % 1).toFixed(2).slice(2)}
                                                    </sup>
                                                </h2>
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden w-full items-center gap-3 lg:flex">
                                        <div className="grid flex-1 grid-cols-1 gap-1.5 py-0.5">
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="sm:text-base font-bold p-0 h-11 sm:h-auto text-sm xs:text-base sm:p-3 my-1 rounded-md duration-200 ease-in-out hover:opacity-90 disabled:opacity-70 bg-gradient-light hover:shadow-lg"
                                            >
                                                {t('addToCart')}
                                            </button>
                                        </div>
                                        <div className="w-[118px]">
                                            <button
                                                onClick={handleToggleFavourite}
                                                className="group flex h-[48px] w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 px-3 leading-3 flex-col justify-center lg:flex-row lg:justify-start"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#1f2323"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className={twMerge(
                                                        'h-[18px] w-[18px] transition-all duration-300 ease-in-out group-hover:fill-gray-700',
                                                        isFavourite && 'fill-gray-700',
                                                    )}
                                                >
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                                <div className="-mt-1 text-center text-[10px] lg:mt-0">
                                                    <span className="mr-0.5">{t('addToList')}</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-3 hidden lg:block">
                                        {/* Technical */}
                                        {technicals.map(({ key, title, display }) => (
                                            <div key={key} className="mb-4">
                                                <h3 className="mb-1 text-[10px] font-bold uppercase text-gray-700 xs:mb-2 lg:font-normal">
                                                    {title}: {typeof display === 'string' ? <b>{display}</b> : display}
                                                </h3>
                                                {key === 'Color' ? (
                                                    <div className="mb-5 grid grid-cols-[repeat(auto-fill,26px)] gap-x-4 gap-y-3">
                                                        {product.color && (
                                                            <div className="flex items-center justify-center">
                                                                <div className="h-[26px] w-[26px]">
                                                                    <div
                                                                        className="flex h-full w-full items-center justify-center rounded-full ring-2 ring-gray-700 ring-offset-2"
                                                                        style={{ backgroundColor: product.color.hex }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="gap-2 grid grid-cols-4"
                                                        id={`e2e-product-${key.toLowerCase()}`}
                                                    >
                                                        {display && (
                                                            <div>
                                                                <div className="h-full w-full flex items-center justify-center leading-3 py-3 bg-white text-center text-xs border border-gray-700 rounded font-bold">
                                                                    {typeof display === 'string'
                                                                        ? display
                                                                        : (product as any)[key.toLowerCase()]?.name ||
                                                                          (product as Record<string, any>)[
                                                                              key.toLowerCase()
                                                                          ]?.t}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {/* Description */}
                                        <div className="mt-4 bg-white text-gray-700">
                                            <h3 className="mb-1 text-lg font-bold">{t('description')}</h3>
                                            <div className="mb-4">
                                                <p className="text-[15px]">{product.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            {/* Related Products */}
            <div className="bg-white py-8">
                <div className="container relative">
                    <h2 className="flex items-center text-lg font-semibold md:text-xl mb-4">{t('relatedTitle')}</h2>
                    <>
                        <Swiper
                            modules={[Navigation]}
                            slidesPerView={4}
                            spaceBetween={20}
                            slidesPerGroup={4}
                            speed={700}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            onSlideChange={() => console.log('slide change')}
                        >
                            {relatedProducts.map((relatedProduct) => (
                                <SwiperSlide key={relatedProduct.id}>
                                    <Link href={`/collections/details/${relatedProduct.slug}`}>
                                        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border bg-white hover:shadow-md transition-shadow duration-300">
                                            <div className="block w-full px-2 py-4 xs:px-3 sm:py-5">
                                                <div className="relative pb-[75%]">
                                                    <div className="absolute left-0 top-1/2 h-3/4 w-full -translate-y-1/2">
                                                        <Image
                                                            src={relatedProduct.images[0]?.url || '/placeholder.png'}
                                                            alt={relatedProduct.name}
                                                            width={200}
                                                            height={150}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-center text-xs font-semibold text-gray-700 xxs:text-sm two-line-ellipsis">
                                                    {relatedProduct.name}
                                                </h3>
                                                <div className="text-center text-xs text-gray-700">
                                                    ${Math.floor(relatedProduct.price)}
                                                    <sup>.{(relatedProduct.price % 1).toFixed(2).slice(2)}</sup>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <DeviceSliderBtn swiperRef={swiperRef} />
                    </>
                </div>
            </div>
        </>
    );
}
