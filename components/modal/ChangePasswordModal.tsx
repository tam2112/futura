'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordSchema } from '@/lib/validation/user.form';
import { changeUserPassword } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';

export default function ChangePasswordModal({
    setOpenModal,
}: {
    openModal: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
    const t = useTranslations('UserForm');
    const locale = useLocale() as 'en' | 'vi';
    const userId = Cookies.get('userId') || '';
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema(locale)),
    });

    const onSubmit = handleSubmit(async (data) => {
        const response = await changeUserPassword({ success: false, error: false }, { ...data, userId, locale });

        if (response.success) {
            toast(t('passwordChangeSuccess'));
            reset();
            setOpenModal(false);
        } else {
            toast.error(response.message || t('passwordChangeFailed'));
        }
    });

    return (
        <div className="fixed z-[9999] top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white min-w-[400px] relative p-8 rounded-lg">
                <div className="absolute top-4 right-4">
                    <HiOutlineXMark size={20} onClick={() => setOpenModal(false)} className="cursor-pointer" />
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <h2 className="text-xl font-heading font-semibold text-center">Change password</h2>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1 w-[420px]">
                            <label htmlFor="oldPassword">Old password</label>
                            <div className="relative bg-white border border-black rounded-lg w-[420px]">
                                <input
                                    id="oldPassword"
                                    type={showOldPassword ? 'text' : 'password'}
                                    {...register('oldPassword')}
                                    className="px-4 py-2 min-w-[419px] rounded-lg outline-none pl-[52px]"
                                />
                                <div
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute top-1/2 -translate-y-1/2 left-0"
                                >
                                    {showOldPassword ? (
                                        <PiEyeLight className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    ) : (
                                        <PiEyeClosedLight className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    )}
                                </div>
                                <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                            </div>
                            {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-[420px]">
                            <label htmlFor="newPassword">New password</label>
                            <div className="relative bg-white border border-black rounded-lg w-[420px]">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...register('newPassword')}
                                    className="px-4 py-2 min-w-[419px] rounded-lg outline-none pl-[52px]"
                                />
                                <div
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute top-1/2 -translate-y-1/2 left-0"
                                >
                                    {showNewPassword ? (
                                        <PiEyeLight className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    ) : (
                                        <PiEyeClosedLight className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    )}
                                </div>
                                <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                            </div>
                            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1 w-[420px]">
                            <label htmlFor="confirmNewPassword">Confirm new password</label>
                            <div className="relative bg-white border border-black rounded-lg w-[420px]">
                                <input
                                    id="confirmNewPassword"
                                    type={showConfirmNewPassword ? 'text' : 'password'}
                                    {...register('confirmNewPassword')}
                                    className="px-4 py-2 min-w-[419px] rounded-lg outline-none pl-[52px]"
                                />
                                <div
                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    className="absolute top-1/2 -translate-y-1/2 left-0"
                                >
                                    {showConfirmNewPassword ? (
                                        <PiEyeLight className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    ) : (
                                        <PiEyeClosedLight className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    )}
                                </div>
                                <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                            </div>
                            {errors.confirmNewPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-light font-semibold">
                            Change
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 rounded-lg bg-slate-200"
                            onClick={() => setOpenModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
