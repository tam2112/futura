/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// @ts-ignore
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import { batteryHealthSchema, BatteryHealthSchema } from '@/lib/validation/technical/battery-health.form';
import { createBatteryHealth, updateBatteryHealth } from '@/lib/actions/technical/battery-health.action';

export default function BatteryHealthForm({
    type,
    data,
    setOpen,
}: {
    type: 'create' | 'update' | 'details';
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BatteryHealthSchema>({
        resolver: zodResolver(batteryHealthSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createBatteryHealth : updateBatteryHealth, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit(async (formData) => {
        const data = { ...formData };
        formAction(data);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Battery health has been ${type === 'create' ? 'created' : 'updated'}`);
            setOpen(false);
            router.refresh();
        } else {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? 'Create a new battery health' : 'Update the battery health'}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Title"
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

            <button className="bg-gradient-light p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}
