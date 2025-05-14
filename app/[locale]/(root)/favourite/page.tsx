/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { PiHeart, PiShoppingBagOpenLight, PiSignOut, PiUser } from 'react-icons/pi';
import avatarImage from '@/public/default-avatar.png';
import Button from '@/components/Button';
import Cookies from 'js-cookie';
import { Link, usePathname, useRouter } from '@/navigation';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/AuthContext';
import GoToTop from '@/components/GoToTop';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { getUserFavourites, toggleFavourite } from '@/lib/actions/product.action';
import { toast } from 'react-toastify';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function FavouritePage() {
    const t = useTranslations('Favourite');
    const a = useTranslations('AccountManagement');
    const p = useTranslations('ProductDetails');

    const fullName = Cookies.get('fullName') || 'Robert';
    const email = Cookies.get('email') || 'abc@gmail.com';
    const userId = Cookies.get('userId');
    const locale = useLocale() as 'en' | 'vi';

    const pathname = usePathname();

    const { logout } = useAuth();
    const router = useRouter();
    const [favourites, setFavourites] = useState<any[]>([]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const fetchFavourites = async () => {
        if (userId) {
            const favouriteProducts = await getUserFavourites(userId);
            setFavourites(favouriteProducts);
        }
    };

    useEffect(() => {
        fetchFavourites();
    }, [userId]);

    const handleToggleFavourite = async (productId: string) => {
        if (!userId) {
            toast.error(p('notLoggedIn'));
            return;
        }
        const response = await toggleFavourite({ success: false, error: false }, { productId, locale, userId });

        if (response.success) {
            toast.success(response.message);
            fetchFavourites(); // Refresh the favourites list
        } else {
            toast.error(response.message);
        }
    };

    return (
        <>
            <GoToTop />
            <div className="min-h-[70vh] mt-[180px] px-16 pb-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* menu */}
                    <div
                        className="col-span-1 bg-white min-h-[500px] border-slate-200 border rounded-lg max-h-[70vh] sticky top-[180px] left-0"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 15px 20px -10px' }}
                    >
                        <div className="flex flex-col justify-between h-full p-6">
                            {/* item */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold font-heading">{a('title')}</h2>
                                <div className="space-y-2">
                                    <div className="relative w-max">
                                        <Link href="/favourite">
                                            <Button
                                                variant="text"
                                                className={twMerge(
                                                    'flex items-center gap-2',
                                                    pathname === '/favourite' &&
                                                        'rounded-lg font-medium h-auto border-transparent after:transition-all after:duration-500 after:content-[""] after:h-[2px] after:absolute after:top-[90%] after:bg-gradient after:w-full',
                                                )}
                                            >
                                                <PiHeart />
                                                <p>{a('favourite')}</p>
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="relative w-max">
                                        <Link href="/my-orders">
                                            <Button
                                                variant="text"
                                                className={twMerge(
                                                    'flex items-center gap-2',
                                                    pathname === '/my-orders' &&
                                                        'rounded-lg font-medium h-auto border-transparent after:transition-all after:duration-500 after:content-[""] after:h-[2px] after:absolute after:top-[90%] after:bg-gradient after:w-full',
                                                )}
                                            >
                                                <PiShoppingBagOpenLight />
                                                <p>{a('myOrders')}</p>
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="relative w-max">
                                        <Link href="/my-profile">
                                            <Button
                                                variant="text"
                                                className={twMerge(
                                                    'flex items-center gap-2',
                                                    pathname === '/my-profile' &&
                                                        'rounded-lg font-medium h-auto border-transparent after:transition-all after:duration-500 after:content-[""] after:h-[2px] after:absolute after:top-[90%] after:bg-gradient after:w-full',
                                                )}
                                            >
                                                <PiUser />
                                                <p>{a('myProfile')}</p>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* account */}
                            <div className="space-y-4">
                                <div className="border border-black rounded-full size-[68px] flex items-center justify-center">
                                    <Image src={avatarImage} alt="" className="size-16" />
                                </div>
                                <div>
                                    <p>{fullName}</p>
                                    <p className="font-light text-sm">{email}</p>
                                </div>
                                <div className="relative w-max">
                                    <Button variant="text" className="flex items-center gap-2" onClick={handleLogout}>
                                        <PiSignOut />
                                        <p>{a('signOut')}</p>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* content */}
                    <div className="col-span-2 space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold font-heading">{t('title')}</h2>
                            <p className="text-sm font-light">{t('description')}</p>
                        </div>
                        {favourites.length > 0 ? (
                            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {favourites.map((product) => (
                                    <div
                                        key={product.id}
                                        className="mr-[-1px] mb-[-1px] flex flex-col border border-gray-100 bg-white px-2 pt-5 pb-3 xs:px-4 xs:pt-7 xs:pb-3 group/collections-device relative"
                                    >
                                        <Link href={`/collections/details/${product.slug}`} className="mt-8">
                                            <div className="flex h-full flex-col gap-3">
                                                <div className="flex-1 px-3">
                                                    <div className="relative h-full min-h-[100px] w-full">
                                                        <Image
                                                            src={product.images[0]?.url || '/placeholder.png'}
                                                            alt={product.name}
                                                            width={280}
                                                            height={120}
                                                            className="h-[18vw] object-contain xs:h-[13vw] sm:h-[10vw] lg:h-[7vw] xl:h-[95px] group-hover/collections-device:scale-95 transition-all duration-300"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 items-center justify-between">
                                                    <div className="w-full">
                                                        <h3 className="three-line-ellipsis text-sm">{product.name}</h3>
                                                        <div className="mt-3 flex items-center justify-between">
                                                            <div className="flex flex-col justify-center">
                                                                {product.priceWithDiscount && (
                                                                    <h3 className="text-sm font-semibold">
                                                                        ${product.priceWithDiscount.toFixed(2)}
                                                                    </h3>
                                                                )}
                                                                {product.priceWithDiscount ? (
                                                                    <h4 className="text-xs text-slate-gray-300 line-through">
                                                                        ${product.price.toFixed(2)}
                                                                    </h4>
                                                                ) : (
                                                                    <h4 className="text-sm font-semibold">
                                                                        ${product.price.toFixed(2)}
                                                                    </h4>
                                                                )}
                                                            </div>
                                                            {product.priceWithDiscount &&
                                                                product.promotions?.[0]?.percentageNumber && (
                                                                    <div className="mb-2 ml-2 flex items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-[11px] text-white xs:mb-0 xs:ml-1 sm:ml-0">
                                                                        {t('save')}{' '}
                                                                        <span className="ml-1 font-semibold">
                                                                            {product.promotions[0].percentageNumber}%
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => handleToggleFavourite(product.id)}
                                            className="absolute top-1 right-1 px-3 py-2 rounded-lg border border-black hover:bg-gradient-light"
                                        >
                                            <HiOutlineXMark size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">{t('noFavourites')}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
