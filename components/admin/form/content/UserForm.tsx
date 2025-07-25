'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import { userSchema, UserSchema } from '@/lib/validation/user.form';
import { createUser, updateUser } from '@/lib/actions/user.action';
import SelectField from '@/components/form/SelectField';
import { useLocale, useTranslations } from 'next-intl';

// Define type for the user data (used for update)
type UserData = {
    id: string;
    fullName: string;
    email: string;
    password?: string; // Optional since password may not be required for updates
    roleId: string;
};

// Define type for relatedData
type Role = { id: string; name: string };
type RelatedData = {
    roles: Role[];
};

export default function UserForm({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: 'create' | 'update' | 'details';
    data?: UserData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: RelatedData;
}) {
    const t = useTranslations('UserForm');
    const locale = useLocale() as 'en' | 'vi';
    const createUserSchema = userSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<UserSchema>({
        resolver: zodResolver(createUserSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createUser : updateUser, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit(async (formData) => {
        const dataWithLocale = { ...formData, locale };
        formAction(dataWithLocale);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast.success(t('createSuccess', { type: type === 'create' ? t('created') : t('updated') }));
            setOpen(false);
            router.refresh();
        } else if (state.error && state.message) {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen, t]);

    const { roles = [] } = relatedData ?? {};

    const roleOptions = roles.map((role: { id: string; name: string }) => ({
        value: role.id,
        label: role.name,
    }));

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? t('createTitle') : t('updateTitle')}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label={t('fullName')}
                    name="fullName"
                    defaultValue={data?.fullName}
                    register={register}
                    error={errors.fullName}
                    hideIcon
                />
                <InputField
                    label={t('email')}
                    name="email"
                    type="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors.email}
                    hideIcon
                />
                <InputField
                    label={t('password')}
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors.password}
                    hideIcon
                />
                <SelectField
                    label={t('role')}
                    name="roleId"
                    options={roleOptions}
                    control={control}
                    error={errors.roleId}
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
