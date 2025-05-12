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
import { useTranslations } from 'next-intl';

export default function FavouritePage() {
    const t = useTranslations('Favourite');
    const a = useTranslations('AccountManagement');

    const fullName = Cookies.get('fullName') || 'Robert';
    const email = Cookies.get('email') || 'abc@gmail.com';

    const pathname = usePathname();

    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
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
                    </div>
                </div>
            </div>
        </>
    );
}
