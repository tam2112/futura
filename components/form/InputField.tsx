'use client';

import { ReactNode, useState } from 'react';
import { FieldError } from 'react-hook-form';

/* eslint-disable @typescript-eslint/no-explicit-any */
type InputFieldProps = {
    label: string;
    type?: string;
    register: any;
    name: string;
    defaultValue?: string | Date;
    icon?: ReactNode;
    iconEyeOn?: ReactNode;
    iconEyeOff?: ReactNode;
    error?: FieldError;
    hidden?: boolean;
    onChange?: () => void;
    className?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function InputField({
    label,
    type = 'text',
    register,
    name,
    defaultValue,
    icon,
    iconEyeOn,
    iconEyeOff,
    error,
    hidden,
    onChange,
    className,
    inputProps,
}: InputFieldProps) {
    // show and hide input type password
    const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className={hidden ? 'hidden' : 'block space-y-1'}>
            {name === 'password' || name === 'confirmPassword' ? (
                <div className="flex flex-col gap-1">
                    <label htmlFor={name}>{label}</label>
                    <div className="relative bg-white border border-black rounded-lg">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register(name)}
                            className={`px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none ${className}`}
                            onChange={onChange}
                            {...inputProps}
                            defaultValue={defaultValue}
                            placeholder={`Enter your ${label}`}
                            min={type === 'date' ? '1950-01-01' : undefined}
                            max={type === 'date' ? '2020-12-31' : undefined}
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 -translate-y-1/2 left-0"
                        >
                            {showPassword ? iconEyeOn : iconEyeOff}
                        </div>
                        <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    <label htmlFor={name}>{label}</label>
                    <div className="relative bg-white border border-black rounded-lg">
                        <input
                            type={type}
                            {...register(name)}
                            placeholder={`Enter your ${label}`}
                            className={`px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none ${className}`}
                            onChange={onChange}
                            defaultValue={defaultValue}
                            {...inputProps}
                        />
                        {icon}
                        <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                    </div>
                </div>
            )}
            {error?.message && <p className="text-xs text-red-400 max-w-[300px]">{error?.message.toString()}</p>}
        </div>
    );
}
