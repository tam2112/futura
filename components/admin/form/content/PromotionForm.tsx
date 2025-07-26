'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import { twMerge } from 'tailwind-merge';
import SelectField from '@/components/form/SelectField';
import { promotionSchema, PromotionSchema } from '@/lib/validation/promotion.form';
import { createPromotion, updatePromotion } from '@/lib/actions/promotion.action';
import { useLocale, useTranslations } from 'next-intl';

// Define type for the promotion data (used for update)
type PromotionData = {
    id: string;
    name: string;
    percentageNumber: number;
    durationType: 'date' | 'hours' | 'minutes' | 'seconds';
    startDate?: string;
    endDate?: string;
    startHours?: number;
    endHours?: number;
    startMinutes?: number;
    endMinutes?: number;
    startSeconds?: number;
    endSeconds?: number;
    products?: { id: string; name: string }[];
    categories?: { id: string; name: string }[];
};

// Define types for relatedData arrays
type Category = { id: string; name: string };
type Product = { id: string; name: string };

type RelatedData = {
    categories: Category[];
    products: Product[];
};

export default function PromotionForm({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: 'create' | 'update' | 'details';
    data?: PromotionData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: RelatedData;
}) {
    const t = useTranslations('PromotionForm');
    const locale = useLocale() as 'en' | 'vi';
    const createPromotionSchema = promotionSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        getValues,
        watch,
    } = useForm<PromotionSchema>({
        resolver: zodResolver(createPromotionSchema),
        defaultValues: {
            id: data?.id || '',
            name: data?.name || '',
            percentageNumber: data?.percentageNumber || 0,
            durationType: data?.durationType || 'date',
            startDate: data?.startDate
                ? new Date(data.startDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
            endDate: data?.endDate
                ? new Date(data.endDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
            startHours: data?.startHours || 0,
            endHours: data?.endHours || 0,
            startMinutes: data?.startMinutes || 0,
            endMinutes: data?.endMinutes || 0,
            startSeconds: data?.startSeconds || 0,
            endSeconds: data?.endSeconds || 0,
            productIds: data?.products?.map((p: Product) => p.id).filter(Boolean) || [],
            categoryIds: data?.categories?.map((c: Category) => c.id).filter(Boolean) || [],
        },
    });

    const [state, formAction] = useFormState(type === 'create' ? createPromotion : updatePromotion, {
        success: false,
        error: false,
    });
    const [tab, setTab] = useState('main');
    const [selectedOption, setSelectedOption] = useState<'product' | 'category'>(
        (data?.products?.length ?? 0) > 0 ? 'product' : 'category',
    );

    const durationType = watch('durationType');

    const onSubmit = handleSubmit(async (formData) => {
        const data = {
            ...formData,
            productIds:
                selectedOption === 'product'
                    ? formData.productIds?.filter((id) => id).map((id) => id.toString()) || []
                    : [],
            categoryIds:
                selectedOption === 'category'
                    ? formData.categoryIds?.filter((id) => id).map((id) => id.toString()) || []
                    : [],
            locale,
        };
        try {
            formAction(data);
        } catch (error) {
            console.error('Form action error:', error);
        }
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(t('createSuccess', { type: type === 'create' ? t('created') : t('updated') }));
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen, t]);

    useEffect(() => {
        console.log('Form type:', type);
        console.log('Data:', data);
        console.log('Default values:', getValues());
        console.log('Related data:', relatedData);
        console.log('Form errors:', errors);
    }, [type, data, relatedData, getValues, errors]);

    const { categories, products } = relatedData || { categories: [], products: [] };

    const categoryOptions = [
        ...(data?.categories?.map((c: Category) => ({
            value: c.id,
            label: c.name,
        })) || []),
        ...categories.map((category: { id: string; name: string }) => ({
            value: category.id,
            label: category.name,
        })),
    ].filter((option, index, self) => self.findIndex((o) => o.value === option.value) === index);

    const productOptions = [
        ...(data?.products?.map((p: Product) => ({
            value: p.id,
            label: p.name,
        })) || []),
        ...products.map((product: { id: string; name: string }) => ({
            value: product.id,
            label: product.name,
        })),
    ].filter((option, index, self) => self.findIndex((o) => o.value === option.value) === index);

    const handleOptionChange = (option: 'product' | 'category') => {
        if (type === 'create') {
            setSelectedOption(option);
            setTab(option);
        }
    };

    return (
        <form
            method="POST"
            className="flex flex-col gap-8 max-h-[500px] overflow-y-auto hide-scrollbar"
            onSubmit={onSubmit}
        >
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? t('createTitle') : t('updateTitle')}
            </h1>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setTab('main')}
                    className={twMerge(
                        'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                        tab === 'main' && 'bg-gradient-lighter font-semibold',
                    )}
                >
                    {t('main')}
                </button>
                {selectedOption !== 'category' && (
                    <button
                        type="button"
                        onClick={() => setTab('product')}
                        className={twMerge(
                            'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                            tab === 'product' && 'bg-gradient-lighter font-semibold',
                        )}
                    >
                        {t('product')}
                    </button>
                )}
                {selectedOption !== 'product' && (
                    <button
                        type="button"
                        onClick={() => setTab('category')}
                        className={twMerge(
                            'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                            tab === 'category' && 'bg-gradient-lighter font-semibold',
                        )}
                    >
                        {t('category')}
                    </button>
                )}
            </div>
            {tab === 'main' && (
                <>
                    <div className="flex justify-between flex-wrap gap-4">
                        <InputField
                            label={t('promotionName')}
                            name="name"
                            register={register}
                            error={errors.name}
                            hideIcon
                        />
                        <InputField
                            label={t('percentageNumber')}
                            name="percentageNumber"
                            type="number"
                            register={register}
                            error={errors.percentageNumber}
                            hideIcon
                        />
                        <div className="w-full space-y-1">
                            <label>{t('durationType')}</label>
                            <div className="relative bg-white border border-black rounded-lg">
                                <select
                                    {...register('durationType')}
                                    className="px-4 py-2 w-full rounded-lg outline-none"
                                >
                                    <option value="date">{t('dateRange')}</option>
                                    <option value="hours">{t('hourRange')}</option>
                                    <option value="minutes">{t('minuteRange')}</option>
                                    <option value="seconds">{t('secondRange')}</option>
                                </select>
                            </div>
                            {errors.durationType && (
                                <p className="mt-1 text-sm text-red-600">{errors.durationType.message}</p>
                            )}
                        </div>
                        {durationType === 'date' && (
                            <>
                                <InputField
                                    label={t('startDate')}
                                    name="startDate"
                                    type="date"
                                    register={register}
                                    error={errors.startDate}
                                    hideIcon
                                />
                                <InputField
                                    label={t('endDate')}
                                    name="endDate"
                                    type="date"
                                    register={register}
                                    error={errors.endDate}
                                    hideIcon
                                />
                            </>
                        )}
                        {durationType === 'hours' && (
                            <>
                                <InputField
                                    label={t('startHour')}
                                    name="startHours"
                                    type="number"
                                    register={register}
                                    error={errors.startHours}
                                    hideIcon
                                />
                                <InputField
                                    label={t('endHour')}
                                    name="endHours"
                                    type="number"
                                    register={register}
                                    error={errors.endHours}
                                    hideIcon
                                />
                            </>
                        )}
                        {durationType === 'minutes' && (
                            <>
                                <InputField
                                    label={t('startMinute')}
                                    name="startMinutes"
                                    type="number"
                                    register={register}
                                    error={errors.startMinutes}
                                    hideIcon
                                />
                                <InputField
                                    label={t('endMinute')}
                                    name="endMinutes"
                                    type="number"
                                    register={register}
                                    error={errors.endMinutes}
                                    hideIcon
                                />
                            </>
                        )}
                        {durationType === 'seconds' && (
                            <>
                                <InputField
                                    label={t('startSecond')}
                                    name="startSeconds"
                                    type="number"
                                    register={register}
                                    error={errors.startSeconds}
                                    hideIcon
                                />
                                <InputField
                                    label={t('endSecond')}
                                    name="endSeconds"
                                    type="number"
                                    register={register}
                                    error={errors.endSeconds}
                                    hideIcon
                                />
                            </>
                        )}
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
                    <div>
                        <h2>{t('option')}</h2>
                        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                <div className="flex items-center ps-3">
                                    <input
                                        id="productOption"
                                        type="radio"
                                        value="product"
                                        name="option-promo"
                                        checked={selectedOption === 'product'}
                                        onChange={() => handleOptionChange('product')}
                                        disabled={type === 'update'}
                                        className="w-4 h-4 bg-gray-100 border-gray-300"
                                    />
                                    <label
                                        htmlFor="productOption"
                                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                                    >
                                        {t('product')}
                                    </label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                <div className="flex items-center ps-3">
                                    <input
                                        id="categoryOption"
                                        type="radio"
                                        value="category"
                                        name="option-promo"
                                        checked={selectedOption === 'category'}
                                        onChange={() => handleOptionChange('category')}
                                        disabled={type === 'update'}
                                        className="w-4 h-4 bg-gray-100 border-gray-300"
                                    />
                                    <label
                                        htmlFor="categoryOption"
                                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                                    >
                                        {t('category')}
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </>
            )}
            {tab === 'product' && (
                <div className="flex justify-between flex-wrap gap-4">
                    <SelectField
                        label={t('product')}
                        name="productIds"
                        options={productOptions}
                        control={control}
                        error={errors.productIds}
                        isMulti
                    />
                </div>
            )}
            {tab === 'category' && (
                <div className="flex justify-between flex-wrap gap-4">
                    <SelectField
                        label={t('category')}
                        name="categoryIds"
                        options={categoryOptions}
                        control={control}
                        error={errors.categoryIds}
                        isMulti
                    />
                </div>
            )}

            <button className="bg-gradient-light p-2 rounded-md">
                {type === 'create' ? t('create') : t('update')}
            </button>
        </form>
    );
}
