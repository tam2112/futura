import { useTranslations } from 'next-intl';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import Select from 'react-select';
import { twMerge } from 'tailwind-merge';

type SelectFieldProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    options: { value: string; label: string }[];
    defaultValue?: T[Path<T>];
    control: Control<T>;
    error?: { message?: string };
    className?: string;
    isMulti?: boolean;
};

export default function SelectField<T extends FieldValues>({
    label,
    name,
    options,
    control,
    error,
    className,
    isMulti = false,
}: SelectFieldProps<T>) {
    const t = useTranslations('Common');

    const { field } = useController({
        name,
        control,
    });

    return (
        <div className={twMerge('flex flex-col gap-1', className)}>
            <label htmlFor={name}>{label}</label>
            <div className="relative min-w-[320px]">
                <Select
                    id={name}
                    options={options}
                    value={
                        isMulti
                            ? options.filter((option) => field.value?.includes(option.value))
                            : options.find((option) => option.value === field.value) || null
                    }
                    onChange={(selected) => {
                        if (isMulti) {
                            field.onChange(Array.isArray(selected) ? selected.map((option) => option.value) : []);
                        } else {
                            const singleOption = selected as { value: string } | null;
                            field.onChange(singleOption?.value ?? '');
                        }
                    }}
                    onBlur={field.onBlur}
                    classNamePrefix="react-select"
                    placeholder={`${t('select')} ${label}`}
                    isClearable
                    isMulti={isMulti}
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #000',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease-in-out',
                        }),
                        menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginTop: '4px',
                        }),
                        menuList: (base) => ({
                            ...base,
                            maxHeight: '200px',
                            overflowY: 'auto',
                        }),
                    }}
                />
            </div>
            {error?.message && <p className="text-xs text-red-400">{error.message}</p>}
        </div>
    );
}
