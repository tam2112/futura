/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function PromotionForm({
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
        getValues,
        watch,
    } = useForm<PromotionSchema>({
        resolver: zodResolver(promotionSchema),
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
            productIds: data?.products?.map((p: any) => p.id).filter(Boolean) || [],
            categoryIds: data?.categories?.map((c: any) => c.id).filter(Boolean) || [],
        },
    });

    const [state, formAction] = useFormState(type === 'create' ? createPromotion : updatePromotion, {
        success: false,
        error: false,
    });
    const [tab, setTab] = useState('main');
    const [selectedOption, setSelectedOption] = useState<'product' | 'category'>(
        data?.products?.length > 0 ? 'product' : 'category',
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
            toast(`Promotion has been ${type === 'create' ? 'created' : 'updated'}`);
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen]);

    useEffect(() => {
        console.log('Form type:', type);
        console.log('Data:', data);
        console.log('Default values:', getValues());
        console.log('Related data:', relatedData);
        console.log('Form errors:', errors);
    }, [type, data, relatedData, getValues, errors]);

    const { categories, products } = relatedData || { categories: [], products: [] };

    const categoryOptions = [
        ...(data?.categories?.map((c: any) => ({
            value: c.id,
            label: c.name,
        })) || []),
        ...categories.map((category: { id: string; name: string }) => ({
            value: category.id,
            label: category.name,
        })),
    ].filter((option, index, self) => self.findIndex((o) => o.value === option.value) === index);

    const productOptions = [
        ...(data?.products?.map((p: any) => ({
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
                {type === 'create' ? 'Create a new promotion' : 'Update the promotion'}
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
                    Main
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
                        Product
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
                        Category
                    </button>
                )}
            </div>
            {tab === 'main' && (
                <>
                    <div className="flex justify-between flex-wrap gap-4">
                        <InputField
                            label="Promotion name"
                            name="name"
                            register={register}
                            error={errors.name}
                            hideIcon
                        />
                        <InputField
                            label="Percentage Number"
                            name="percentageNumber"
                            type="number"
                            register={register}
                            error={errors.percentageNumber}
                            hideIcon
                        />
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700">Duration Type</label>
                            <select
                                {...register('durationType')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="date">Date Range</option>
                                <option value="hours">Hour Range</option>
                                <option value="minutes">Minute Range</option>
                                <option value="seconds">Second Range</option>
                            </select>
                            {errors.durationType && (
                                <p className="mt-1 text-sm text-red-600">{errors.durationType.message}</p>
                            )}
                        </div>
                        {durationType === 'date' && (
                            <>
                                <InputField
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    register={register}
                                    error={errors.startDate}
                                    hideIcon
                                />
                                <InputField
                                    label="End Date"
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
                                    label="Start Hour (0-23)"
                                    name="startHours"
                                    type="number"
                                    register={register}
                                    error={errors.startHours}
                                    hideIcon
                                />
                                <InputField
                                    label="End Hour (0-23)"
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
                                    label="Start Minute (0-59)"
                                    name="startMinutes"
                                    type="number"
                                    register={register}
                                    error={errors.startMinutes}
                                    hideIcon
                                />
                                <InputField
                                    label="End Minute (0-59)"
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
                                    label="Start Second (0-59)"
                                    name="startSeconds"
                                    type="number"
                                    register={register}
                                    error={errors.startSeconds}
                                    hideIcon
                                />
                                <InputField
                                    label="End Second (0-59)"
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
                        <h2>Option</h2>
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
                                        Product
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
                                        Category
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
                        label="Product"
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
                        label="Category"
                        name="categoryIds"
                        options={categoryOptions}
                        control={control}
                        error={errors.categoryIds}
                        isMulti
                    />
                </div>
            )}

            <button className="bg-gradient-light p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}
