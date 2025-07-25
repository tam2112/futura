'use client';

import { createCategory, updateCategory } from '@/lib/actions/category.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { categorySchema, CategorySchema } from '@/lib/validation/category.form';
import InputField from '@/components/form/InputField';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { uploadImagesToCloudinary } from '@/lib/upload';
import { useLocale, useTranslations } from 'next-intl';
// import { uploadFileToServer } from '@/lib/upload';
// import { uploadImages } from '@/lib/actions/image.action';

// Define type for the category data (used for update)
type CategoryData = {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
};

export default function CategoryForm({
    type,
    data,
    setOpen,
}: {
    type: 'create' | 'update' | 'details';
    data?: CategoryData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: CategoryData[];
}) {
    const t = useTranslations('CategoryForm');
    const locale = useLocale() as 'en' | 'vi';
    const createCategorySchema = categorySchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategorySchema>({
        resolver: zodResolver(createCategorySchema),
    });

    const [files, setFiles] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
        type === 'update' && data?.images ? data.images.map((img: { url: string }) => img.url) : [],
    );

    // AFTER REACT 19 IT'LL BE USEACTIONSTATE
    const [state, formAction] = useFormState(type === 'create' ? createCategory : updateCategory, {
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
                toast.error(t('uploadImageFailed'));
                return;
            }
        } else if (type === 'update') {
            // Use remaining existing image URLs if no new files are uploaded
            imageUrls = existingImageUrls;
        }

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const dataWithImageUrls = { ...formData, imageUrls, locale };
        formAction(dataWithImageUrls);
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
        <form method="POST" className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-heading font-semibold">
                {type === 'create' ? t('createTitle') : t('updateTitle')}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label={t('categoryName')}
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                    hideIcon
                />
                <InputField
                    label={t('description')}
                    name="description"
                    defaultValue={data?.description}
                    register={register}
                    error={errors.description}
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
                <h2>{t('image')}</h2>
                <FileUploadDropzone
                    files={files}
                    setFiles={(files) => setFiles(files ?? [])}
                    existingImageUrls={existingImageUrls}
                    onRemoveExistingImage={handleRemoveExistingImage}
                />
            </div>

            <button className="bg-gradient-light p-2 rounded-md">
                {type === 'create' ? t('create') : t('update')}
            </button>
        </form>
    );
}
