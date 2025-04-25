/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
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

// export const getCategoryById = async (categoryId: string) => {
//     try {
//         const category = await prisma.category.findUnique({
//             where: { id: categoryId },
//             include: { images: true },
//         });
//         if (!category) {
//             throw new Error('Category not found');
//         }
//         return category;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const createCategory = async (currentState: CurrentState, data: CategorySchema & { imageUrls?: string[] }) => {
    try {
        const slug = generateSlug(data.name);

        const newCategory = await prisma.category.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
            },
        });

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
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Category name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to create category' };
    }
};

export const updateCategory = async (currentState: CurrentState, data: CategorySchema & { imageUrls?: string[] }) => {
    try {
        if (!data.id) {
            throw new Error('Category ID is required for update');
        }

        const newSlug = generateSlug(data.name);

        const updatedCategory = await prisma.category.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: newSlug,
                description: data.description,
            },
        });

        await prisma.image.deleteMany({
            where: { categoryId: updatedCategory.id },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    categoryId: updatedCategory.id,
                    createdDate: new Date(),
                })),
            });
        }

        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Category name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to update category' };
    }
};

export const deleteCategory = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Category ID is required');
        }

        await prisma.category.delete({
            where: {
                id: id,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error('Delete category error:', error);
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

        revalidatePath('/admin/category/list');
        return { success: true, error: false };
    } catch (error) {
        console.error('Delete categories error:', error);
        return { success: false, error: true };
    }
};

export async function exportCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                images: {
                    select: { url: true },
                },
            },
        });

        // Format data for Excel
        const formattedData = categories.map((category) => ({
            Name: category.name,
            Description: category.description || '',
            ImageURLs: category.images.map((img) => img.url).join(', ') || '',
            CreatedAt: category.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export categories error:', error);
        return { success: false, error: 'Failed to export categories' };
    }
}
