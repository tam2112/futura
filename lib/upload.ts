// lib/upload.ts
'use client';

export const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // Lưu ý: dùng NEXT_PUBLIC_ để truy cập từ client
    const uploadPreset = 'futura'; // Thay bằng upload preset từ Cloudinary dashboard

    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (result.secure_url) {
            uploadedUrls.push(result.secure_url);
        } else {
            throw new Error('Failed to upload image');
        }
    }

    return uploadedUrls;
};
