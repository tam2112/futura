'use client';

import { FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

/* eslint-disable @typescript-eslint/no-explicit-any */
type TextareaFieldProps = {
    label: string;
    name: string;
    register: any;
    defaultValue?: string;
    error?: FieldError;
    className?: string;
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export default function TextareaField({
    label,
    name,
    register,
    defaultValue,
    error,
    className,
    textareaProps,
}: TextareaFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={name}>{label}</label>
            <div className="relative bg-white border border-black rounded-lg">
                <textarea
                    {...register(name)}
                    placeholder={`Enter your ${label}`}
                    className={twMerge('px-4 py-2 w-full min-h-[100px] rounded-lg outline-none resize-y', className)}
                    defaultValue={defaultValue}
                    {...textareaProps}
                />
            </div>
            {error?.message && <p className="text-xs text-red-400 max-w-[300px]">{error.message.toString()}</p>}
        </div>
    );
}
