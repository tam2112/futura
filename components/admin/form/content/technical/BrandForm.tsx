/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// @ts-ignore
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputField from '@/components/form/InputField';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { uploadImagesToCloudinary } from '@/lib/upload';
import { brandSchema, BrandSchema } from '@/lib/validation/technical/brand.form';
import { createBrand, updateBrand } from '@/lib/actions/technical/brand.action';
// import { uploadFileToServer } from '@/lib/upload';
// import { uploadImages } from '@/lib/actions/image.action';

export default function BrandForm({
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
    } = useForm<BrandSchema>({
        resolver: zodResolver(brandSchema),
    });

    const [files, setFiles] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
        type === 'update' && data?.images ? data.images.map((img: { url: string }) => img.url) : [],
    );

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createBrand : updateBrand, {
        success: false,
        error: false,
    });

    const handleRemoveExistingImage = (index: number) => {
        setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = handleSubmit(async (formData) => {
        let imageUrls: string[] = [];

        // Upload new images to Cloudinary if there are new files
        if (files.length > 0) {
            try {
                imageUrls = await uploadImagesToCloudinary(files);
            } catch (error) {
                toast.error('Failed to upload images');
                return;
            }
        } else if (type === 'update') {
            // Use remaining existing image URLs if no new files are uploaded
            imageUrls = existingImageUrls;
        }

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const dataWithImageUrls = { ...formData, imageUrls };
        formAction(dataWithImageUrls);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Brand has been ${type === 'create' ? 'created' : 'updated'}`);
            setOpen(false);
            router.refresh();
        }
    }, [state, type, router, setOpen]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? 'Create a new brand' : 'Update the brand'}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Brand name"
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
            <div>
                <h2>Image</h2>
                <FileUploadDropzone
                    files={files}
                    setFiles={setFiles}
                    existingImageUrls={existingImageUrls}
                    onRemoveExistingImage={handleRemoveExistingImage}
                />
            </div>

            <button className="bg-gradient-light p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}
