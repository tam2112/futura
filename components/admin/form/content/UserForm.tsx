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
import { userSchema, UserSchema } from '@/lib/validation/user.form';
import { createUser, updateUser } from '@/lib/actions/user.action';
import SelectField from '@/components/form/SelectField';

export default function ColorForm({
    type,
    data,
    setOpen,
    relatedData,
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
        control,
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createUser : updateUser, {
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
            toast(`User has been ${type === 'create' ? 'created' : 'updated'}`);
            setOpen(false);
            router.refresh();
        } else {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen]);

    const { roles } = relatedData;

    const roleOptions = roles.map((role: { id: string; name: string }) => ({
        value: role.id,
        label: role.name,
    }));

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? 'Create a new user' : 'Update the user'}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Full name"
                    name="fullName"
                    defaultValue={data?.fullName}
                    register={register}
                    error={errors.fullName}
                    hideIcon
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors.email}
                    hideIcon
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors.password}
                    hideIcon
                />
                <SelectField label="Role" name="roleId" options={roleOptions} control={control} error={errors.roleId} />
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
