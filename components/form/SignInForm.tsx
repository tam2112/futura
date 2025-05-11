/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/navigation';
import { loginSchema, LoginSchema } from '@/lib/validation/user.form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// @ts-ignore
import { useEffect, useState } from 'react';
import { signInUser } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

import { RxEnvelopeClosed } from 'react-icons/rx';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';

import heroImg from '@/public/log-hero-v3.png';
import { useAuth } from '@/context/AuthContext';
import { useLocale, useTranslations } from 'next-intl';

export default function SignInForm() {
    const t = useTranslations('SignInPage');
    const locale = useLocale() as 'en' | 'vi';
    const createLoginSchema = loginSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<LoginSchema>({
        resolver: zodResolver(createLoginSchema),
    });

    const router = useRouter();
    const currentLocale = useLocale();

    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [state, formAction] = useState({
        success: false,
        error: false,
        message: '',
    });

    // show and hide input type password
    const [showPassword, setShowPassword] = useState(false);

    const { setIsLoggedIn } = useAuth();

    const onSubmit = handleSubmit(async (data) => {
        const response = await signInUser(state, data, locale);

        if (response.success) {
            if (response.token) {
                Cookies.set('token', response.token, { expires: 1 });
            }
            if (response.userId) {
                Cookies.set('userId', response.userId);
            }
            if (response.fullName) {
                Cookies.set('fullName', response.fullName);
            }
            if (response.role) {
                Cookies.set('role', response.role);
            }
            setIsLoggedIn(true);
            toast(t('signInSuccess'));

            // Redirect based on role
            if (response.role === 'admin') {
                await router.push('/admin', { locale: currentLocale });
            } else {
                await router.push('/', { locale: currentLocale });
            }
        } else {
            toast.error(response.message || t('signInFailed'));
            setTouchedFields({});
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
            // Khi submit form, đánh dấu tất cả các trường là đã được submit
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
                {/* image */}
                <div className="flex flex-col justify-center items-center h-full overflow-hidden rounded-lg">
                    <Image src={heroImg} alt="hero img" className="scale-[1.5] rounded-lg" />
                </div>
                {/* form */}
                <form onSubmit={onSubmit} className="flex flex-col justify-center items-center">
                    <h2 className="font-heading font-bold text-4xl mb-8">{t('logIn')}</h2>
                    <div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor={'email'}>{t('email')}</label>
                                <div className="relative bg-white border border-black rounded-lg">
                                    <input
                                        type="email"
                                        {...register('email')}
                                        placeholder={`${t('emailPlaceholder')}`}
                                        className={`px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none`}
                                        onChange={() => {
                                            handleFieldChange('email'), clearErrors('email');
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
                            <div className="flex flex-col gap-1">
                                <label htmlFor={'password'}>{t('password')}</label>
                                <div className="relative bg-white border border-black rounded-lg">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        placeholder={`${t('passwordPlaceholder')}`}
                                        className={`px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none`}
                                        onChange={() => {
                                            handleFieldChange('password'), clearErrors('password');
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
                                {touchedFields.password && errors.password?.message && (
                                    <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            <div>
                                <button type="submit" className="bg-gradient-light w-full py-2 rounded-lg font-bold">
                                    {t('logIn')}
                                </button>
                            </div>
                            <div className="">
                                <p>
                                    {t('newCustomer')}{' '}
                                    <Link href="/sign-up" className="font-bold cursor-pointer hover:underline">
                                        {t('createAccount')}
                                    </Link>
                                </p>
                            </div>
                            <div className="">
                                <p>
                                    {t('lostPassword')}{' '}
                                    <Link href="/recover" className="font-bold cursor-pointer hover:underline">
                                        {t('recoverPassword')}
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
