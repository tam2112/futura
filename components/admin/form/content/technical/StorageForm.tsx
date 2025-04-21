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
import { storageSchema, StorageSchema } from '@/lib/validation/technical/storage.form';
import { createStorage, updateStorage } from '@/lib/actions/technical/storage.action';

export default function StorageForm({
    type,
    data,
    setOpen,
}: {
    type: 'create' | 'update';
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StorageSchema>({
        resolver: zodResolver(storageSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createStorage : updateStorage, {
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
            toast(`Storage has been ${type === 'create' ? 'created' : 'updated'}`);
            setOpen(false);
            router.refresh();
        }
    }, [state, type, router, setOpen]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? 'Create a new storage' : 'Update the storage'}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Storage name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
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
