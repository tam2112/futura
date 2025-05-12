'use client';

import Image from 'next/image';
import { PiHeart, PiShoppingBagOpenLight, PiSignOut, PiUser } from 'react-icons/pi';
import avatarImage from '@/public/default-avatar.png';
import Button from '@/components/Button';
import Cookies from 'js-cookie';
import { Link, usePathname, useRouter } from '@/navigation';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import ChangePasswordModal from '@/components/modal/ChangePasswordModal';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserFullName } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';
import { useTranslations, useLocale } from 'next-intl';

type FullNameForm = {
    fullName: string;
};

export default function MyProfilePage() {
    const t = useTranslations('UserForm');
    const a = useTranslations('AccountManagement');
    const m = useTranslations('MyProfile');
    const locale = useLocale() as 'en' | 'vi';
    const fullName = Cookies.get('fullName') || 'Robert';
    const email = Cookies.get('email') || 'abc@gmail.com';
    const userId = Cookies.get('userId') || '';
    const [openModal, setOpenModal] = useState(false);

    const pathname = usePathname();

    const { logout } = useAuth();
    const router = useRouter();

    const schema = z.object({
        fullName: z
            .string()
            .nonempty({ message: t('fullNameRequired') })
            .min(2, { message: t('minFullName') }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FullNameForm>({
        resolver: zodResolver(schema),
        defaultValues: { fullName },
    });

    const onSubmit = handleSubmit(async (data) => {
        const response = await updateUserFullName(
            { success: false, error: false },
            { id: userId, fullName: data.fullName, locale },
        );

        if (response.success) {
            Cookies.set('fullName', data.fullName, { expires: 1 });
            toast(t('updateFullNameSuccess'));
        } else {
            toast.error(response.message || t('updateFullNameFailed'));
        }
    });

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <>
            {openModal && <ChangePasswordModal openModal={openModal} setOpenModal={setOpenModal} />}
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
                    {/* Content */}
                    <div className="col-span-2 space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold font-heading">{m('title')}</h2>
                            <p className="text-sm font-light">{m('description')}</p>
                        </div>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex flex-col gap-1 w-[420px]">
                                    <label htmlFor="">{m('email')}</label>
                                    <div className="relative bg-white border border-black rounded-lg w-[420px]">
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="px-4 py-2 min-w-[419px] rounded-lg outline-none cursor-not-allowed disabled:bg-black/5"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-[420px]">
                                    <label htmlFor="fullName">{m('fullName')}</label>
                                    <div className="relative bg-white border border-black rounded-lg w-[420px]">
                                        <input
                                            id="fullName"
                                            type="text"
                                            {...register('fullName')}
                                            className="px-4 py-2 min-w-[419px] rounded-lg outline-none"
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="bg-gradient-lighter hover:bg-gradient-light font-semibold px-6 py-2 rounded-lg"
                                >
                                    {m('update')}
                                </button>
                            </div>
                        </form>
                        <div className="">
                            <p className="mt-10">
                                {m('changePassText')}{' '}
                                <span className="font-bold cursor-pointer" onClick={() => setOpenModal(true)}>
                                    {m('here')}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
