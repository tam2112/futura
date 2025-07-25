'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';
import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form';

type InputFieldProps<T extends FieldValues> = {
    label: string;
    type?: string;
    register: UseFormRegister<T>;
    name: Path<T>;
    defaultValue?: T[Path<T>];
    icon?: ReactNode;
    iconEyeOn?: ReactNode;
    iconEyeOff?: ReactNode;
    hideIcon?: boolean;
    error?: FieldError;
    hidden?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    formType?: 'create' | 'update';
};

export default function InputField<T extends FieldValues>({
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
    hideIcon,
    onChange,
    className,
    inputProps,
    formType,
}: InputFieldProps<T>) {
    const t = useTranslations('Common');

    // show and hide input type password
    const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [hexValue, setHexValue] = useState<string | undefined>(
        formType === 'create' ? '' : typeof defaultValue === 'string' ? defaultValue : undefined,
    );

    // Handle input change for hex field
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (name === 'hex' && formType === 'create') {
            setHexValue(e.target.value);
        }
        onChange?.(e); // Call the original onChange if provided
    };

    return (
        <div className={hidden ? 'hidden' : 'block space-y-1'}>
            {name === 'password' || name === 'confirmPassword' ? (
                <div className="flex flex-col gap-1">
                    <label htmlFor={String(name)}>{label}</label>
                    <div className="relative bg-white border border-black rounded-lg">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register(name)}
                            className={`px-4 ${
                                !hideIcon && 'pl-[52px]'
                            } py-2 min-w-[320px] rounded-lg outline-none ${className}`}
                            onChange={onChange}
                            {...inputProps}
                            defaultValue={defaultValue}
                            placeholder={`${t('placeholder')} ${label}`}
                            min={type === 'date' ? '1950-01-01' : undefined}
                            max={type === 'date' ? '2020-12-31' : undefined}
                        />
                        {!hideIcon && (
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 -translate-y-1/2 left-0"
                            >
                                {showPassword ? iconEyeOn : iconEyeOff}
                            </div>
                        )}
                        {!hideIcon && (
                            <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    <label htmlFor={String(name)}>{label}</label>
                    <div className="relative bg-white border border-black rounded-lg">
                        <input
                            type={type}
                            {...register(name)}
                            placeholder={`${t('placeholder')} ${label}`}
                            className={`px-4 ${
                                !hideIcon || name === 'hex' ? 'pl-[52px]' : ''
                            } py-2 min-w-[320px] rounded-lg outline-none ${className}`}
                            onChange={handleHexChange}
                            defaultValue={defaultValue}
                            {...inputProps}
                        />
                        {!hideIcon && icon}
                        {!hideIcon || name === 'hex' ? (
                            <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                        ) : (
                            <></>
                        )}
                        {name === 'hex' && (
                            <div
                                className="absolute top-1/2 -translate-y-1/2 left-2.5 w-[20px] h-[20px] rounded-lg"
                                style={{
                                    backgroundColor:
                                        hexValue || (typeof defaultValue === 'string' ? defaultValue : undefined),
                                }}
                            ></div>
                        )}
                    </div>
                </div>
            )}
            {error?.message && <p className="text-xs text-red-400 max-w-[300px]">{error?.message.toString()}</p>}
        </div>
    );
}
