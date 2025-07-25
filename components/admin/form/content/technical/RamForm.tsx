'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import { ramSchema, RamSchema } from '@/lib/validation/technical/ram.form';
import { createRam, updateRam } from '@/lib/actions/technical/ram.action';
import { useLocale, useTranslations } from 'next-intl';

type RamData = {
    id: string;
    title: string;
};

export default function RamForm({
    type,
    data,
    setOpen,
}: {
    type: 'create' | 'update' | 'details';
    data?: RamData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: RamData[];
}) {
    const t = useTranslations('RamForm');
    const locale = useLocale() as 'en' | 'vi';
    const createRamSchema = ramSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RamSchema>({
        resolver: zodResolver(createRamSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createRam : updateRam, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit(async (formData) => {
        const data = { ...formData, locale };
        formAction(data);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(t('createSuccess', { type: type === 'create' ? t('created') : t('updated') }));
            setOpen(false);
            router.refresh();
        } else {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen, t]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? t('createTitle') : t('updateTitle')}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label={t('title')}
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors.title}
                    hideIcon
                />
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors.id}
                        hidden
                    />
                )}
            </div>

            <button className="bg-gradient-light p-2 rounded-md">
                {type === 'create' ? t('create') : t('update')}
            </button>
        </form>
    );
}
