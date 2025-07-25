'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import { simSlotSchema, SimSlotSchema } from '@/lib/validation/technical/sim-slot.form';
import { createSimSlot, updateSimSlot } from '@/lib/actions/technical/sim-slot.action';
import { useLocale, useTranslations } from 'next-intl';

type SimSlotData = {
    id: string;
    title: string;
};

export default function SimSlotForm({
    type,
    data,
    setOpen,
}: {
    type: 'create' | 'update' | 'details';
    data?: SimSlotData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: SimSlotData[];
}) {
    const t = useTranslations('SimSlotForm');
    const locale = useLocale() as 'en' | 'vi';
    const createSimSlotSchema = simSlotSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SimSlotSchema>({
        resolver: zodResolver(createSimSlotSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createSimSlot : updateSimSlot, {
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
