'use client';

import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

type TextareaFieldProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    defaultValue?: T[Path<T>];
    error?: FieldError;
    className?: string;
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export default function TextareaField<T extends FieldValues>({
    label,
    name,
    register,
    defaultValue,
    error,
    className,
    textareaProps,
}: TextareaFieldProps<T>) {
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
