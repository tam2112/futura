/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { uploadImagesToCloudinary } from '@/lib/upload';
import { productSchema, ProductSchema } from '@/lib/validation/product.form';
import { createProduct, updateProduct } from '@/lib/actions/product.action';
import { twMerge } from 'tailwind-merge';
import { categoryTechnicalMap } from '@/constants/categoryTechnicalMap';
import SelectField from '@/components/form/SelectField';
import TextareaField from '@/components/form/TextareaField';

export default function ProductForm({
    type,
    data,
    setOpen,
    relatedData,
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
        watch,
        control,
    } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            id: data?.id || '',
            name: data?.name || '',
            description: data?.description || '',
            price: data?.price || 0,
            quantity: data?.quantity || 0,
            categoryId: data?.categoryId || '',
            brandId: data?.brandId || '',
            colorId: data?.colorId || '',
            storageId: data?.storageId || '',
            connectivityId: data?.connectivityId || '',
            simSlotId: data?.simSlotId || '',
            batteryHealthId: data?.batteryHealthId || '',
            ramId: data?.ramId || '',
            cpuId: data?.cpuId || '',
            screenSizeId: data?.screenSizeId || '',
            typeId: data?.typeId || '',
        },
    });

    const [files, setFiles] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
        type === 'update' && data?.images ? data.images.map((img: { url: string }) => img.url) : [],
    );
    const [tab, setTab] = useState('main');

    // Theo dõi giá trị categoryId
    const selectedCategoryId = watch('categoryId');

    // Lấy category name từ categoryId
    const selectedCategory = relatedData?.categories
        ?.find((category: { id: string }) => category.id === selectedCategoryId)
        ?.name.toLowerCase();

    const [state, formAction] = useFormState(type === 'create' ? createProduct : updateProduct, {
        success: false,
        error: false,
    });

    const handleRemoveExistingImage = (index: number) => {
        setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = handleSubmit(async (formData) => {
        let imageUrls: string[] = [];

        if (files.length > 0) {
            try {
                imageUrls = await uploadImagesToCloudinary(files);
            } catch (error) {
                toast.error('Failed to upload images');
                return;
            }
        } else if (type === 'update') {
            imageUrls = existingImageUrls;
        }

        const dataWithImageUrls = { ...formData, imageUrls };
        formAction(dataWithImageUrls);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Product has been ${type === 'create' ? 'created' : 'updated'}`);
            setOpen(false);
            router.refresh();
        } else {
            toast.error(state.message);
        }
    }, [state, type, router, setOpen]);

    const {
        categories,
        brands,
        colors,
        storages,
        connectivities,
        simSlots,
        batteryHealths,
        rams,
        cpus,
        screenSizes,
        types,
    } = relatedData;

    // Hàm kiểm tra xem technical có nên hiển thị không
    const shouldShowTechnical = (technical: string) => {
        if (!selectedCategory) return true; // Hiển thị tất cả nếu chưa chọn category
        return categoryTechnicalMap[selectedCategory]?.includes(technical);
    };

    // Định dạng options cho react-select
    const categoryOptions = categories.map((category: { id: string; name: string }) => ({
        value: category.id,
        label: category.name,
    }));
    const brandOptions = brands.map((brand: { id: string; name: string }) => ({
        value: brand.id,
        label: brand.name,
    }));
    const colorOptions = colors.map((color: { id: string; name: string; hex: string }) => ({
        value: color.id,
        label: `${color.name} - ${color.hex}`,
    }));
    const storageOptions = storages.map((storage: { id: string; name: string }) => ({
        value: storage.id,
        label: storage.name,
    }));
    const connectivityOptions = connectivities.map((connectivity: { id: string; name: string }) => ({
        value: connectivity.id,
        label: connectivity.name,
    }));
    const simSlotOptions = simSlots.map((simSlot: { id: string; title: string }) => ({
        value: simSlot.id,
        label: simSlot.title,
    }));
    const batteryHealthOptions = batteryHealths.map((batteryHealth: { id: string; title: string }) => ({
        value: batteryHealth.id,
        label: batteryHealth.title,
    }));
    const ramOptions = rams.map((ram: { id: string; title: string }) => ({
        value: ram.id,
        label: ram.title,
    }));
    const cpuOptions = cpus.map((cpu: { id: string; name: string }) => ({
        value: cpu.id,
        label: cpu.name,
    }));
    const screenSizeOptions = screenSizes.map((screenSize: { id: string; name: string }) => ({
        value: screenSize.id,
        label: screenSize.name,
    }));
    const typeOptions = types.map((type: { id: string; name: string }) => ({
        value: type.id,
        label: type.name,
    }));

    return (
        <form
            method="POST"
            className="flex flex-col gap-8 max-h-[500px] overflow-y-auto hide-scrollbar"
            onSubmit={onSubmit}
        >
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? 'Create a new product' : 'Update the product'}
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
                <button
                    type="button"
                    onClick={() => setTab('technical')}
                    className={twMerge(
                        'bg-white px-4 py-1 rounded-lg hover:bg-gradient-lighter transition-all duration-300',
                        tab === 'technical' && 'bg-gradient-lighter font-semibold',
                    )}
                >
                    Technical
                </button>
            </div>
            {tab === 'main' && (
                <>
                    <div className="flex justify-between flex-wrap gap-4">
                        <InputField label="Product name" name="name" register={register} error={errors.name} hideIcon />
                        <InputField label="Price" name="price" register={register} error={errors.price} hideIcon />
                        <InputField
                            label="Quantity"
                            name="quantity"
                            register={register}
                            error={errors.quantity}
                            hideIcon
                        />
                        {/* category */}
                        <SelectField
                            label="Category"
                            name="categoryId"
                            options={categoryOptions}
                            control={control}
                            error={errors.categoryId}
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
                    <div>
                        <TextareaField
                            label="Description"
                            name="description"
                            register={register}
                            error={errors.description}
                        />
                    </div>
                    <div>
                        <h2>Image</h2>
                        <FileUploadDropzone
                            files={files}
                            setFiles={setFiles}
                            existingImageUrls={existingImageUrls}
                            onRemoveExistingImage={handleRemoveExistingImage}
                        />
                    </div>
                </>
            )}
            {tab === 'technical' && (
                <div className="flex justify-between flex-wrap gap-4">
                    {shouldShowTechnical('brand') && (
                        <SelectField
                            label="Brand"
                            name="brandId"
                            options={brandOptions}
                            control={control}
                            error={errors.brandId}
                        />
                    )}
                    {shouldShowTechnical('color') && (
                        <SelectField
                            label="Color"
                            name="colorId"
                            options={colorOptions}
                            control={control}
                            error={errors.colorId}
                        />
                    )}
                    {shouldShowTechnical('storage') && (
                        <SelectField
                            label="Storage"
                            name="storageId"
                            options={storageOptions}
                            control={control}
                            error={errors.storageId}
                        />
                    )}
                    {shouldShowTechnical('connectivity') && (
                        <SelectField
                            label="Connectivity"
                            name="connectivityId"
                            options={connectivityOptions}
                            control={control}
                            error={errors.connectivityId}
                        />
                    )}
                    {shouldShowTechnical('simSlot') && (
                        <SelectField
                            label="Sim slot"
                            name="simSlotId"
                            options={simSlotOptions}
                            control={control}
                            error={errors.simSlotId}
                        />
                    )}
                    {shouldShowTechnical('batteryHealth') && (
                        <SelectField
                            label="Battery health"
                            name="batteryHealthId"
                            options={batteryHealthOptions}
                            control={control}
                            error={errors.batteryHealthId}
                        />
                    )}
                    {shouldShowTechnical('ram') && (
                        <SelectField
                            label="RAM"
                            name="ramId"
                            options={ramOptions}
                            control={control}
                            error={errors.ramId}
                        />
                    )}
                    {shouldShowTechnical('cpu') && (
                        <SelectField
                            label="CPU"
                            name="cpuId"
                            options={cpuOptions}
                            control={control}
                            error={errors.cpuId}
                        />
                    )}
                    {shouldShowTechnical('screenSize') && (
                        <SelectField
                            label="Screen size"
                            name="screenSizeId"
                            options={screenSizeOptions}
                            control={control}
                            error={errors.screenSizeId}
                        />
                    )}
                    {shouldShowTechnical('type') && (
                        <SelectField
                            label="Type"
                            name="typeId"
                            options={typeOptions}
                            control={control}
                            error={errors.typeId}
                        />
                    )}
                </div>
            )}

            <button className="bg-gradient-light p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}
