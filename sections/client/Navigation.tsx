'use client';

import { CiSearch } from 'react-icons/ci';
import LogoWithName from '../../components/client/LogoWithName';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import Box from '../../components/Box';
import Image from 'next/image';
import { GoChevronDown } from 'react-icons/go';
import Button from '../../components/Button';
import { PiShoppingBagOpenLight, PiUser } from 'react-icons/pi';
import avatarImage from '@/public/default-avatar.png';
import { Link, useRouter } from '@/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import CartModal from '@/components/modal/CartModal';

export default function Navigation() {
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();
    const [isOpenCart, setIsOpenCart] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <>
            <CartModal isOpenCart={isOpenCart} setIsOpenCart={setIsOpenCart} />
            <div className="border-b border-black/5">
                <div className="container">
                    <div className="h-20 flex justify-between items-center">
                        {/* left nav */}
                        <Link href="/">
                            <LogoWithName />
                        </Link>
                        {/* middle nav */}
                        <div className="w-[500px]">
                            <div className="ml-12">
                                <div className="border border-black/60 rounded-full relative">
                                    <CiSearch size={20} className="absolute top-1/2 -translate-y-1/2 ml-3" />
                                    <input
                                        type="text"
                                        placeholder="Search Product"
                                        className="w-full outline-none rounded-full px-4 pl-10 py-2 bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* right nav */}
                        <div className="flex items-center gap-4">
                            {/* account */}
                            <div className="flex items-center gap-4">
                                {/* have an account */}
                                {isLoggedIn ? (
                                    <>
                                        <div
                                            onClick={() => setIsOpenCart(true)}
                                            className="p-2 text-center border border-black/10 rounded-full relative cursor-pointer"
                                        >
                                            <div className="absolute right-0 -top-0 size-4 rounded-full bg-gradient flex items-center justify-center text-xs text-white/85 font-extrabold">
                                                3
                                            </div>
                                            <HiOutlineShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <Box className="py-1 px-4 text-center group relative">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <Image src={avatarImage} alt="" className="size-8" />
                                                    </div>
                                                    <span className="inline-flex gap-1 items-center">
                                                        Robert <GoChevronDown size={20} />
                                                    </span>
                                                </div>
                                                <div className="absolute z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 left-0 top-[49px] w-full shadow-sm">
                                                    <div className="w-full bg-white border border-gray-300 rounded-lg">
                                                        <ul className="flex flex-col items-start font-normal px-3 py-2">
                                                            <li>
                                                                <Button
                                                                    variant="text"
                                                                    className="inline-flex items-center gap-2 font-normal relative"
                                                                >
                                                                    <PiUser size={20} />
                                                                    <span>Profile</span>
                                                                </Button>
                                                            </li>
                                                            <li>
                                                                <Button
                                                                    variant="text"
                                                                    className="inline-flex items-center gap-2 font-normal relative"
                                                                >
                                                                    <PiShoppingBagOpenLight size={20} />
                                                                    <span>My orders</span>
                                                                </Button>
                                                            </li>
                                                            <li className="inline-flex justify-center">
                                                                <Button
                                                                    className="px-[36px] font-medium mt-2"
                                                                    onClick={handleLogout}
                                                                >
                                                                    Sign out
                                                                </Button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </Box>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/sign-in" className="relative">
                                            <Button variant="text" className="after:left-0">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/sign-up">
                                            <Button>Sign Up</Button>
                                        </Link>
                                    </>
                                )}
                                {/* no account */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
