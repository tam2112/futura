'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import { roleSchema, RoleSchema } from '@/lib/validation/role.form';
import { createRole, updateRole } from '@/lib/actions/role.action';
import { useLocale, useTranslations } from 'next-intl';

// Define type for the role data (used for update)
type RoleData = {
    id: string;
    name: string;
};

export default function RoleForm({
    type,
    data,
    setOpen,
}: {
    type: 'create' | 'update' | 'details';
    data?: RoleData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: RoleData[];
}) {
    const t = useTranslations('RoleForm');
    const locale = useLocale() as 'en' | 'vi';
    const createRoleSchema = roleSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RoleSchema>({
        resolver: zodResolver(createRoleSchema),
    });

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createRole : updateRole, {
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
                    label={t('roleName')}
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

            <button className="bg-gradient-light p-2 rounded-md">
                {type === 'create' ? t('create') : t('update')}
            </button>
        </form>
    );
}
