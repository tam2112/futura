'use server';

import { v2 as cloudinary } from 'cloudinary';
import prisma from '../prisma';
import { CloudinaryUploadResult } from '@/types/common';

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

type ImageUploadResponse = { success: boolean; error: boolean; url?: string; imageId?: string };

// Hàm upload ảnh lên Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<ImageUploadResponse> => {
    try {
        // Chuyển file thành buffer để upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload ảnh lên Cloudinary
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: 'image' }, // Chỉ định loại tài nguyên là ảnh
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    },
                )
                .end(buffer);
        });

        // Lưu thông tin ảnh vào Prisma
        const newImage = await prisma.image.create({
            data: {
                url: result.secure_url, // URL an toàn từ Cloudinary
                createdDate: new Date(),
                // Nếu cần liên kết với category hoặc product, thêm categoryId hoặc productId vào đây
            },
        });

        return {
            success: true,
            error: false,
            url: result.secure_url,
            imageId: newImage.id,
        };
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return { success: false, error: true };
    }
};

// Hàm upload nhiều ảnh
export const uploadImagesToCloudinary = async (files: File[]): Promise<ImageUploadResponse> => {
    try {
        const uploadedUrls: string[] = [];
        const uploadedImageIds: string[] = [];

        for (const file of files) {
            const { success, url, imageId } = await uploadImageToCloudinary(file);
            if (!success || !url || !imageId) {
                throw new Error('Failed to upload one or more images');
            }
            uploadedUrls.push(url);
            uploadedImageIds.push(imageId);
        }

        return {
            success: true,
            error: false,
            url: uploadedUrls.join(','), // Trả về danh sách URL cách nhau bởi dấu phẩy
            imageId: uploadedImageIds[0], // Trả về ID của ảnh đầu tiên (tùy chỉnh nếu cần)
        };
    } catch (error) {
        console.error('Error uploading images to Cloudinary:', error);
        return { success: false, error: true };
    }
};
