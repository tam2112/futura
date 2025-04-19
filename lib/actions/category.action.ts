'use server';

import prisma from '../prisma';
import { generateSlug } from '../utils';
import { CategorySchema } from '../validation/category.form';

type CurrentState = { success: boolean; error: boolean };

export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany({});
        return categories;
    } catch (error) {
        console.error(error);
    }
};

export const getCategoryById = async (categoryId: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { images: true },
        });
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createCategory = async (currentState: CurrentState, data: CategorySchema & { imageUrls?: string[] }) => {
    try {
        const slug = generateSlug(data.name);

        // Tạo category mới
        const newCategory = await prisma.category.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
            },
        });

        // Nếu có imageUrls, lưu chúng vào bảng Image và liên kết với category
        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    categoryId: newCategory.id,
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

export const updateCategory = async (currentState: CurrentState, data: CategorySchema & { imageUrls?: string[] }) => {
    try {
        const newSlug = generateSlug(data.name);

        // Cập nhật category
        const updatedCategory = await prisma.category.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: newSlug,
                description: data.description,
            },
        });

        // Delete existing images
        await prisma.image.deleteMany({
            where: { categoryId: updatedCategory.id },
        });

        // If imageUrls are provided, replace existing images
        if (data.imageUrls && data.imageUrls.length > 0) {
            // Create new images
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    categoryId: updatedCategory.id,
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

export const deleteCategory = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        await prisma.category.delete({
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

export const deleteCategories = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.category.deleteMany({
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
