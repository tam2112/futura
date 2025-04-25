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
import { createRole, updateRole } from '@/lib/actions/role.action';
import { roleSchema, RoleSchema } from '@/lib/validation/role.form';
import InputField from '@/components/form/InputField';

export default function RoleForm({
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
    } = useForm<RoleSchema>({
        resolver: zodResolver(roleSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE

    const [state, formAction] = useFormState(type === 'create' ? createRole : updateRole, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        formAction({ ...data });
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Role has been ${type === 'create' ? 'created' : 'updated'}`);
            setOpen(false);
            router.refresh();
        } else {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new role' : 'Update the role'}</h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Role name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
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

            <button className="bg-primary text-white p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}
