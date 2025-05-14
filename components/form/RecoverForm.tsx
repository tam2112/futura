/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/navigation';
import { recoverSchema, RecoverSchema } from '@/lib/validation/user.form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { initiatePasswordRecovery, verifyRecoveryCode, completePasswordRecovery } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';
import { useTranslations, useLocale } from 'next-intl';
import { RxEnvelopeClosed } from 'react-icons/rx';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';
import heroImg from '@/public/log-hero-v3.png';

export default function RecoverForm() {
    const t = useTranslations('RecoverPage');
    const locale = useLocale() as 'en' | 'vi';
    const createRecoverSchema = recoverSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        setValue,
    } = useForm<RecoverSchema>({
        resolver: zodResolver(createRecoverSchema),
        defaultValues: {
            email: '',
            verificationCode: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const router = useRouter();
    const currentLocale = useLocale();

    const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
    const [userId, setUserId] = useState<string | null>(null);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [state, setState] = useState({
        success: false,
        error: false,
        message: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        if (step === 'email') {
            const response = await initiatePasswordRecovery(state, { email: data.email, locale });
            if (response.success && response.userId) {
                setUserId(response.userId);
                setStep('code');
                setValue('email', data.email);
                toast.success(response.message || t('codeSent'));
            } else {
                toast.error(response.message || t('recoveryFailed'));
                setTouchedFields({});
            }
        } else if (step === 'code' && userId) {
            const response = await verifyRecoveryCode(state, {
                userId,
                verificationCode: data.verificationCode!,
                locale,
            });
            if (response.success) {
                setStep('password');
                toast.success(response.message || t('codeVerified'));
            } else {
                toast.error(response.message || t('invalidOrExpiredCode'));
                setTouchedFields({});
            }
        } else if (step === 'password' && userId) {
            const response = await completePasswordRecovery(state, { ...data, userId, locale });
            if (response.success) {
                toast.success(response.message || t('passwordResetSuccess'));
                await router.push('/sign-in', { locale: currentLocale });
            } else {
                toast.error(response.message || t('recoveryFailed'));
                setTouchedFields({});
            }
        }
    });

    const handleFieldChange = (fieldName: string) => {
        setTouchedFields((prev) => ({
            ...prev,
            [fieldName]: false,
        }));
    };

    useEffect(() => {
        if (Object.values(errors).length > 0) {
            const updatedTouchedFields = Object.keys(errors).reduce(
                (acc, fieldName) => ({
                    ...acc,
                    [fieldName]: true,
                }),
                touchedFields,
            );
            setTouchedFields(updatedTouchedFields);
        }
    }, [errors, touchedFields]);

    return (
        <div className="px-16 py-10 min-h-[500px] overflow-hidden">
            <div className="grid grid-cols-2 h-[540px] bg-white relative rounded-lg">
                <div className="absolute w-full top-2 bottom-0 bg-gradient-light blur-md -z-10"></div>
                {/* Image */}
                <div className="flex flex-col justify-center items-center h-full overflow-hidden rounded-lg">
                    <Image src={heroImg} alt="hero img" className="scale-[1.5] rounded-lg" />
                </div>
                {/* Form */}
                <form onSubmit={onSubmit} className="flex flex-col justify-center items-center">
                    <h2 className="font-heading font-bold text-4xl mb-8">{t('recoverPassword')}</h2>
                    <div>
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email">{t('email')}</label>
                                <div className="relative bg-white border border-black rounded-lg">
                                    <input
                                        type="email"
                                        {...register('email')}
                                        placeholder={t('emailPlaceholder')}
                                        className={`px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none ${
                                            step !== 'email' ? 'bg-gray-200 cursor-not-allowed' : ''
                                        }`}
                                        disabled={step !== 'email'}
                                        onChange={() => {
                                            handleFieldChange('email');
                                            clearErrors('email');
                                        }}
                                    />
                                    <RxEnvelopeClosed className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                                </div>
                                {touchedFields.email && errors.email?.message && (
                                    <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Verification Code Input */}
                            {step === 'code' && (
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="verificationCode">{t('verificationCode')}</label>
                                    <div className="relative bg-white border border-black rounded-lg">
                                        <input
                                            type="text"
                                            {...register('verificationCode')}
                                            placeholder={t('codePlaceholder')}
                                            className="px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none"
                                            onChange={() => {
                                                handleFieldChange('verificationCode');
                                                clearErrors('verificationCode');
                                            }}
                                        />
                                        <RxEnvelopeClosed className="absolute top-1/2 -translate-y-1/2 left-3" />
                                        <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                                    </div>
                                    {touchedFields.verificationCode && errors.verificationCode?.message && (
                                        <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                            {errors.verificationCode.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* New Password Input */}
                            {step === 'password' && (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newPassword">{t('newPassword')}</label>
                                        <div className="relative bg-white border border-black rounded-lg">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                {...register('newPassword')}
                                                placeholder={t('passwordPlaceholder')}
                                                className="px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none"
                                                onChange={() => {
                                                    handleFieldChange('newPassword');
                                                    clearErrors('newPassword');
                                                }}
                                            />
                                            <div
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-1/2 -translate-y-1/2 left-3"
                                            >
                                                {showPassword ? <PiEyeLight /> : <PiEyeClosedLight />}
                                            </div>
                                            <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                                        </div>
                                        {touchedFields.newPassword && errors.newPassword?.message && (
                                            <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                                {errors.newPassword.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="confirmNewPassword">{t('confirmNewPassword')}</label>
                                        <div className="relative bg-white border border-black rounded-lg">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                {...register('confirmNewPassword')}
                                                placeholder={t('confirmPasswordPlaceholder')}
                                                className="px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none"
                                                onChange={() => {
                                                    handleFieldChange('confirmNewPassword');
                                                    clearErrors('confirmNewPassword');
                                                }}
                                            />
                                            <div
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute top-1/2 -translate-y-1/2 left-3"
                                            >
                                                {showConfirmPassword ? <PiEyeLight /> : <PiEyeClosedLight />}
                                            </div>
                                            <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                                        </div>
                                        {touchedFields.confirmNewPassword && errors.confirmNewPassword?.message && (
                                            <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                                {errors.confirmNewPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="space-y-3 mt-6">
                            <div>
                                <button type="submit" className="bg-gradient-light w-full py-2 rounded-lg font-bold">
                                    {step === 'password' ? t('recover') : t('confirm')}
                                </button>
                            </div>
                            <div>
                                <p>
                                    {t('backTo')}{' '}
                                    <Link href="/sign-in" className="font-bold cursor-pointer hover:underline">
                                        {t('signIn')}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
