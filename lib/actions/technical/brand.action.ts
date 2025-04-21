'use server';

import prisma from '@/lib/prisma';
import { BrandSchema } from '@/lib/validation/technical/brand.form';

type CurrentState = { success: boolean; error: boolean };

export const getBrands = async () => {
    try {
        const brands = await prisma.brand.findMany({});
        return brands;
    } catch (error) {
        console.error(error);
    }
};

export const getBrandById = async (brandId: string) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id: brandId },
            include: { images: true },
        });
        if (!brand) {
            throw new Error('brand not found');
        }
        return brand;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createBrand = async (currentState: CurrentState, data: BrandSchema & { imageUrls?: string[] }) => {
    try {
        // Tạo brand mới
        const newBrand = await prisma.brand.create({
            data: {
                name: data.name,
                categoryId: data.categoryId,
            },
        });

        // Nếu có imageUrls, lưu chúng vào bảng Image và liên kết với category
        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    brandId: newBrand.id,
                    createdDate: new Date(),
                })),
            });
        }

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const updateBrand = async (currentState: CurrentState, data: BrandSchema & { imageUrls?: string[] }) => {
    try {
        // Cập nhật brand
        const updatedBrand = await prisma.brand.update({
            where: { id: data.id },
            data: {
                name: data.name,
                categoryId: data.categoryId,
            },
        });

        // Delete existing images
        await prisma.image.deleteMany({
            where: { brandId: updatedBrand.id },
        });

        // If imageUrls are provided, replace existing images
        if (data.imageUrls && data.imageUrls.length > 0) {
            // Create new images
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    brandId: updatedBrand.id,
                    createdDate: new Date(),
                })),
            });
        }

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const deleteBrand = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        await prisma.brand.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath('/list/categories');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const deleteBrands = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.brand.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};
