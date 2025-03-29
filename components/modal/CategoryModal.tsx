'use client';

import { useAnimate } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import LogoWithName from '../client/LogoWithName';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineXMark } from 'react-icons/hi2';
import hotDealsImg from '@/public/hot-deals.png';
import Image from 'next/image';
import { allCategoriesData, trendingProductData } from '@/temp/categoryData';
import Button from '../Button';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/AuthContext';
import { PiShoppingBagOpenLight, PiSignOut, PiUser } from 'react-icons/pi';

type CategoryModalType = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CategoryModal({ isOpen, setIsOpen }: CategoryModalType) {
    const [navScope, navAnimate] = useAnimate();
    const [showOverlay, setShowOverlay] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);

    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setShowOverlay(true);
            navAnimate(
                navScope.current,
                {
                    transform: 'translateX(0%)',
                },
                {
                    duration: 0.5,
                },
            );
        } else {
            navAnimate(navScope.current, {
                transform: 'translateX(-100%)',
            });
            setTimeout(() => {
                setShowOverlay(false);
            }, 500); // Thời gian delay phải khớp với thời gian transition
        }
    }, [isOpen, navAnimate, navScope]);

    return (
        <>
            {/* Overlay */}
            {showOverlay && (
                <div
                    className={twMerge(
                        'fixed inset-0 top-0 left-0 w-full h-full bg-black/50 opacity-0 transition-opacity duration-500 z-10',
                        isOpen && 'opacity-100',
                    )}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Modal */}
            <div
                className={twMerge(
                    'fixed top-0 left-0 h-[100dvh] -translate-x-[0%] overflow-x-hidden hide-scrollbar bg-white shadow-md z-10 transition-all duration-500',
                    !isOpen && 'invisible',
                )}
                ref={navScope}
            >
                <div className="w-[325px]">
                    <div className="sticky bg-white z-50 top-0 left-0 right-0">
                        <div className="flex items-center justify-between border-b border-gray-200">
                            <div className="pl-4">
                                <LogoWithName />
                            </div>
                            <div
                                className="text-black py-5 pl-4 pr-4 border-l border-gray-200 cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiOutlineXMark size={30} />
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div
                            className="flex h-[70px] items-center justify-between gap-x-5 rounded-lg px-3"
                            style={{
                                background:
                                    'linear-gradient(90deg, rgb(123, 53, 53) 0%, rgb(31, 35, 35) 40%, rgb(31, 35, 35) 100%)',
                            }}
                        >
                            <div className="h-16">
                                <Image
                                    src={hotDealsImg}
                                    alt="hot deals img"
                                    width={200}
                                    height={100}
                                    className="h-full w-auto rounded-tl-xl object-cover object-right"
                                />
                            </div>
                            <div className="shrink-0 px-4 py-2 bg-red-400 text-white font-semibold rounded-full font-body text-xs">
                                Browse Deals
                            </div>
                        </div>
                    </div>
                    <nav className="mt-4 px-4 flex flex-col space-y-4 divide-y divide-gray-200">
                        {/* Trending */}
                        <div>
                            <h3 className="font-semibold font-heading mb-1">Trending</h3>
                            <ul>
                                {trendingProductData.map(({ id, name }) => (
                                    <li
                                        key={id}
                                        className="text-black py-1.5 group/nav-item relative isolate cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="relative isolate">
                                            <span className="text-sm group-hover/nav-item:pl-4 transition-all duration-500">
                                                {name}
                                            </span>
                                        </div>
                                        <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* All Categories */}
                        <div>
                            <h3 className="font-semibold font-heading mt-4 mb-1">All Categories</h3>
                            <ul>
                                {allCategoriesData
                                    .slice(0, showAllCategories ? allCategoriesData.length : 5)
                                    .map(({ id, name }) => (
                                        <li
                                            key={id}
                                            className="text-black py-1.5 group/nav-item relative isolate cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="relative isolate">
                                                <span className="text-sm group-hover/nav-item:pl-4 transition-all duration-500">
                                                    {name}
                                                </span>
                                            </div>
                                            <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                        </li>
                                    ))}
                                <li
                                    className="text-black py-1.5 group/nav-item relative isolate cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAllCategories(!showAllCategories);
                                    }}
                                >
                                    <div className="relative isolate">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm group-hover/nav-item:pl-4 transition-all duration-500">
                                                {showAllCategories ? 'See Less' : 'See All'}
                                            </span>
                                            {showAllCategories ? (
                                                <HiOutlineChevronUp size={14} />
                                            ) : (
                                                <HiOutlineChevronDown size={14} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                </li>
                            </ul>
                        </div>
                        {/* Settings */}
                        <div>
                            <h3 className="font-semibold font-heading mt-4 mb-2">Settings</h3>
                            {isLoggedIn ? (
                                <ul>
                                    <li
                                        className="text-black py-2 group/nav-item relative isolate cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="relative isolate">
                                            <span className="text-sm group-hover/nav-item:pl-4 transition-all duration-500 flex items-center gap-1">
                                                <PiUser size={14} />
                                                <span className="ml-2">My Profile</span>
                                            </span>
                                        </div>
                                        <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                    </li>
                                    <li
                                        className="text-black py-2 group/nav-item relative isolate cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="relative isolate">
                                            <span className="text-sm group-hover/nav-item:pl-4 transition-all duration-500 flex items-center gap-1">
                                                <PiShoppingBagOpenLight size={14} />
                                                <span className="ml-2">My Orders</span>
                                            </span>
                                        </div>
                                        <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                    </li>
                                    <li
                                        className="text-black py-2 group/nav-item relative isolate cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="relative isolate">
                                            <span className="text-sm group-hover/nav-item:pl-4 transition-all duration-500 flex items-center gap-1">
                                                <PiSignOut size={14} />
                                                <span className="ml-2">Sign Out</span>
                                            </span>
                                        </div>
                                        <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="flex items-center justify-center gap-4">
                                    <li className="relative">
                                        <Button variant="text" className="after:left-0">
                                            Sign Up
                                        </Button>
                                    </li>
                                    <li>
                                        <Button>Sign In</Button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
