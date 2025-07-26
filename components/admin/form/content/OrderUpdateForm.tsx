'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { z } from 'zod';
import SelectField from '@/components/form/SelectField';
import { updateOrderStatus } from '@/lib/actions/order.action';
import { useLocale, useTranslations } from 'next-intl';

// Define the schema for the form
export const orderUpdateSchema = z.object({
    id: z.string().min(1, { message: 'Order ID is required' }),
    statusId: z.string().min(1, { message: 'Status is required' }),
});

export type OrderUpdateSchema = z.infer<typeof orderUpdateSchema>;

// Define types for data and relatedData
type OrderData = {
    id: string;
    statusId: string;
    status?: {
        name: string;
    };
};

type RelatedData = {
    statuses: { id: string; name: string }[];
};

export default function OrderUpdateForm({
    data,
    setOpen,
    relatedData,
}: {
    type?: 'update';
    data?: OrderData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: RelatedData;
}) {
    const t = useTranslations('OrderForm');
    const locale = useLocale() as 'en' | 'vi';

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<OrderUpdateSchema>({
        resolver: zodResolver(orderUpdateSchema),
        defaultValues: {
            id: data?.id,
            statusId: data?.statusId,
        },
    });

    const [state, setState] = useState({
        success: false,
        error: false,
        message: '',
    });

    const formAction = async ({ orderId, statusId }: { orderId: string; statusId: string }) => {
        try {
            const response = await updateOrderStatus({ orderId, statusId, locale });
            setState({ success: true, error: false, message: response.message! });
        } catch (error) {
            setState({ success: false, error: true, message: 'Failed to update order' });
        }
    };

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(t('updateSuccess'));
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            toast.error(state.message);
        }
    }, [state, router, setOpen, t]);

    // If the order is cancelled, show a message instead of the form
    if (data?.status?.name === 'Cancelled') {
        return (
            <div className="flex flex-col gap-4">
                <h1 className="text-lg font-heading font-semibold">{t('title')}</h1>
                <p className="text-red-500">{t('cancelText')}</p>
                <button onClick={() => setOpen(false)} className="bg-gray-300 p-2 rounded-md w-max self-center">
                    {t('close')}
                </button>
            </div>
        );
    }

    // Filter statuses to only include Pending, Out for delivery, and Delivered
    const allowedStatuses = ['Pending', 'Out for delivery', 'Delivered'];
    const filteredStatuses = relatedData?.statuses?.filter((status) => allowedStatuses.includes(status.name)) || [];

    const statusOptions = filteredStatuses.map((status) => ({
        value: status.id,
        label: status.name,
    }));

    const onSubmit = handleSubmit(async (formData) => {
        formAction({ orderId: formData.id, statusId: formData.statusId });
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">{t('title')}</h1>
            <div className="flex justify-between flex-wrap gap-4">
                <SelectField
                    label={t('status')}
                    name="statusId"
                    options={statusOptions}
                    control={control}
                    error={errors.statusId}
                />
                <input type="hidden" name="id" value={data?.id} />
            </div>
            <button className="bg-gradient-light p-2 rounded-md">{t('update')}</button>
        </form>
    );
}
