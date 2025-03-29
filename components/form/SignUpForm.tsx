/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/navigation';
import { signUpSchema, SignUpSchema } from '@/lib/validation/user.form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// @ts-ignore
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { signUpUser } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';

import { RxEnvelopeClosed } from 'react-icons/rx';
import { TbUserEdit } from 'react-icons/tb';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';

import heroImg from '@/public/log-hero-v3.png';
import InputField from './InputField';
import { useLocale } from 'next-intl';

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
    });

    const router = useRouter();
    const currentLocale = useLocale();

    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    const [state, formAction] = useFormState(signUpUser, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        formAction({ ...data });
    });

    const handleFieldChange = (fieldName: string) => {
        setTouchedFields((prev) => ({
            ...prev,
            [fieldName]: false, // Đặt lại trạng thái lỗi cho trường này
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

    useEffect(() => {
        console.log('State updated:', state);
        if (state.success) {
            toast(`Sign up successful`);
            router.push('/sign-in', { locale: currentLocale });
        }
        if (state.error) {
            toast.error(state.message);
        }
    }, [state, router, currentLocale]);

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
                    <h2 className="font-heading font-bold text-4xl mb-8">Sign Up</h2>
                    <div>
                        <div className="space-y-4">
                            <InputField
                                label="Full name"
                                name="fullName"
                                register={register}
                                error={touchedFields.fullName ? errors.fullName : undefined}
                                icon={<TbUserEdit className="absolute top-1/2 -translate-y-1/2 left-3" />}
                                onChange={() => {
                                    handleFieldChange('fullName'), clearErrors('fullName');
                                }}
                            />
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                register={register}
                                error={touchedFields.email ? errors.email : undefined}
                                icon={<RxEnvelopeClosed className="absolute top-1/2 -translate-y-1/2 left-3" />}
                                onChange={() => {
                                    handleFieldChange('email'), clearErrors('email');
                                }}
                            />
                            <InputField
                                label="Password"
                                name="password"
                                className="pr-8"
                                register={register}
                                error={touchedFields.password ? errors.password : undefined}
                                iconEyeOff={<PiEyeClosedLight className="absolute top-1/2 -translate-y-1/2 left-3" />}
                                iconEyeOn={<PiEyeLight className="absolute top-1/2 -translate-y-1/2 left-3" />}
                                onChange={() => {
                                    handleFieldChange('password'), clearErrors('password');
                                }}
                            />
                        </div>
                        <div className="space-y-3 mt-6">
                            <div>
                                <button className="bg-gradient-light w-full py-2 rounded-lg font-bold">
                                    Create my account
                                </button>
                            </div>
                            <div className="">
                                <p>
                                    Already a member? Log in{' '}
                                    <Link href="/sign-in" className="font-bold cursor-pointer hover:underline">
                                        here
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
