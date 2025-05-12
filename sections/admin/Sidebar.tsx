'use client';

import { useAuth } from '@/context/AuthContext';
import { Link, usePathname, useRouter } from '@/navigation';
import { MdOutlineSpeakerNotes } from 'react-icons/md';
import LogoWithName from '@/components/client/LogoWithName';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { CiLogout } from 'react-icons/ci';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CiBoxes, CiDiscount1, CiHome, CiPenpot, CiUnlock, CiUser, CiWavePulse1 } from 'react-icons/ci';
import { GiSmartphone } from 'react-icons/gi';
import { PiGearThin } from 'react-icons/pi';
import { useTranslations } from 'next-intl';
import SettingModal from '@/components/modal/SettingModal';

export default function Sidebar() {
    const t = useTranslations('Sidebar');
    const [openSettingModal, setOpenSettingModal] = useState(false);

    const sidebarMenuLinks = [
        { name: t('home'), icon: <CiHome width={18} height={18} />, path: '/admin' },
        { name: t('user'), icon: <CiUser width={18} height={18} />, path: '/admin/user/list' },
        { name: t('category'), icon: <CiPenpot width={18} height={18} />, path: '/admin/category/list' },
        { name: t('product'), icon: <GiSmartphone width={18} height={18} />, path: '/admin/product/list' },
        { name: t('promotion'), icon: <CiDiscount1 width={18} height={18} />, path: '/admin/promotion/list' },
        { name: t('order'), icon: <CiBoxes width={18} height={18} />, path: '/admin/order/list' },
        { name: t('status'), icon: <CiWavePulse1 width={18} height={18} />, path: '/admin/status/list' },
        { name: t('role'), icon: <CiUnlock width={18} height={18} />, path: '/admin/role/list' },
    ];

    const technicalLinks = [
        { name: t('brand'), path: '/admin/technical/brand/list' },
        { name: t('color'), path: '/admin/technical/color/list' },
        { name: t('storage'), path: '/admin/technical/storage/list' },
        { name: t('connectivity'), path: '/admin/technical/connectivity/list' },
        { name: t('simSlot'), path: '/admin/technical/sim-slot/list' },
        { name: t('batteryHealth'), path: '/admin/technical/battery-health/list' },
        { name: t('ram'), path: '/admin/technical/ram/list' },
        { name: t('cpu'), path: '/admin/technical/cpu/list' },
        { name: t('screenSize'), path: '/admin/technical/screen-size/list' },
        { name: t('type'), path: '/admin/technical/type/list' },
    ];

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
        <>
            {openSettingModal && <SettingModal openModal={openSettingModal} setOpenModal={setOpenSettingModal} />}
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
                        <h2 className="font-heading font-semibold px-3">{t('menu')}</h2>
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
                                        (isTechnicalOpen || technicalLinks.some((link) => pathname === link.path)) &&
                                            'bg-gradient-light text-white font-semibold',
                                    )}
                                >
                                    <MdOutlineSpeakerNotes width={18} height={18} />
                                    <span className="flex items-center w-full">
                                        {t('technical')}{' '}
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
                                                    className={twMerge(
                                                        'text-black block py-1.5 group/tech-item relative isolate cursor-pointer',
                                                        pathname === path && 'bg-gradient-lighter pl-4',
                                                    )}
                                                >
                                                    <div className="relative isolate">
                                                        <span
                                                            className={twMerge(
                                                                'text-sm group-hover/tech-item:pl-4 transition-all duration-500',
                                                                pathname === path && 'group-hover/tech-item:pl-0',
                                                            )}
                                                        >
                                                            {name}
                                                        </span>
                                                    </div>
                                                    {pathname !== path && (
                                                        <div
                                                            className={twMerge(
                                                                'absolute w-full h-0 bg-gradient-lighter group-hover/tech-item:h-full transition-all duration-500 bottom-0 -z-10',
                                                            )}
                                                        ></div>
                                                    )}
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
                        <h2 className="font-heading font-semibold px-1">{t('others')}</h2>
                        <div className="space-y-1">
                            <div
                                onClick={() => setOpenSettingModal(true)}
                                className="flex gap-3 items-center bg-white py-2 px-4 hover:bg-gradient-light hover:text-white hover:font-semibold rounded-lg transition-all duration-300 cursor-pointer"
                            >
                                <PiGearThin width={18} height={18} />
                                {t('settings')}
                            </div>
                            <div
                                onClick={handleLogout}
                                className="cursor-pointer flex gap-3 items-center bg-white py-2 px-4 hover:bg-gradient-light hover:text-white hover:font-semibold rounded-lg transition-all duration-300"
                            >
                                <CiLogout width={18} height={18} />
                                {t('logout')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
