'use client';

import { useAuth } from '@/context/AuthContext';
import { Link, usePathname, useRouter } from '@/navigation';
import { MdOutlineSpeakerNotes } from 'react-icons/md';
import LogoWithName from '@/components/client/LogoWithName';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { sidebarMenuLinks, sidebarOtherLinks, technicalLinks } from '@/constants/sidebarLink';
import { CiLogout } from 'react-icons/ci';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Sidebar() {
    const { logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [isTechnicalOpen, setIsTechnicalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const toggleTechnical = () => {
        setIsTechnicalOpen(!isTechnicalOpen);
    };

    return (
        <div className="fixed top-0 left-0 bottom-0 bg-white min-w-[260px] shadow-sm px-2 py-3 overflow-y-auto hide-scrollbar">
            {/* logo */}
            <div className="relative mt-3 mb-8 px-4">
                <Link href="/admin">
                    <LogoWithName />
                </Link>
            </div>
            <div className="flex flex-col gap-10">
                {/* menu */}
                <div className="flex flex-col gap-3">
                    <h2 className="font-heading font-semibold px-3">Menu</h2>
                    {/* list */}
                    <div className="space-y-1">
                        {sidebarMenuLinks.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                className={twMerge(
                                    'flex gap-3 items-center bg-white py-2 px-4 hover:bg-gradient-light hover:text-white hover:font-semibold rounded-lg transition-all duration-300',
                                    pathname === item.path && 'bg-gradient-light text-white font-semibold',
                                )}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        {/* technical links */}
                        <div className="">
                            <div
                                onClick={toggleTechnical}
                                className={twMerge(
                                    'cursor-pointer flex gap-3 items-center bg-white py-2 px-4 hover:bg-gradient-light hover:text-white hover:font-semibold rounded-lg transition-all duration-300',
                                    isTechnicalOpen && 'bg-gradient-light text-white font-semibold',
                                )}
                            >
                                <MdOutlineSpeakerNotes width={18} height={18} />
                                <span className="flex items-center w-full">
                                    Technical{' '}
                                    {isTechnicalOpen ? (
                                        <GoChevronUp size={18} className="ml-auto" />
                                    ) : (
                                        <GoChevronDown size={18} className="ml-auto" />
                                    )}
                                </span>
                            </div>
                            <div
                                className={`px-4 bg-gradient-more-lighter rounded-lg transition-all duration-300 ${
                                    isTechnicalOpen
                                        ? 'h-64 visible py-2 overflow-y-auto hide-scrollbar'
                                        : 'h-0 invisible overflow-hidden'
                                }`}
                            >
                                <ul className="space-y-1 py-2">
                                    {technicalLinks.map(({ name, path }, index) => (
                                        <li key={index}>
                                            <Link
                                                href={path}
                                                className="text-black block py-1.5 group/tech-item relative isolate cursor-pointer"
                                            >
                                                <div className="relative isolate">
                                                    <span className="text-sm group-hover/tech-item:pl-4 transition-all duration-500">
                                                        {name}
                                                    </span>
                                                </div>
                                                <div
                                                    className={twMerge(
                                                        'absolute w-full h-0 bg-gradient-lighter group-hover/tech-item:h-full transition-all duration-500 bottom-0 -z-10',
                                                        pathname === path && 'bg-gradient-lighter',
                                                    )}
                                                ></div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* others */}
                <div className="flex flex-col gap-3">
                    <h2 className="font-heading font-semibold px-1">Others</h2>
                    <div className="space-y-1">
                        {sidebarOtherLinks.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                className="flex gap-3 items-center bg-white py-2 px-4 hover:bg-gradient-light hover:text-white hover:font-semibold rounded-lg transition-all duration-300"
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        <div
                            onClick={handleLogout}
                            className="cursor-pointer flex gap-3 items-center bg-white py-2 px-4 hover:bg-gradient-light hover:text-white hover:font-semibold rounded-lg transition-all duration-300"
                        >
                            <CiLogout width={18} height={18} />
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
