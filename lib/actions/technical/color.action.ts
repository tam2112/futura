'use server';

import prisma from '@/lib/prisma';
import { ColorSchema } from '@/lib/validation/technical/color.form';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getColors = async () => {
    try {
        const colors = await prisma.color.findMany({});
        return colors;
    } catch (error) {
        console.error(error);
    }
};

export const getColorById = async (colorId: string) => {
    try {
        const color = await prisma.color.findUnique({
            where: { id: colorId },
        });
        if (!color) {
            throw new Error('color not found');
        }
        return color;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createColor = async (currentState: CurrentState, data: ColorSchema) => {
    try {
        // Tạo color mới
        await prisma.color.create({
            data: {
                name: data.name,
                hex: data.hex,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const updateColor = async (currentState: CurrentState, data: ColorSchema) => {
    try {
        // Cập nhật color
        await prisma.color.update({
            where: { id: data.id },
            data: {
                name: data.name,
                hex: data.hex,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const deleteColor = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Color ID is required');
        }

        await prisma.color.delete({
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

export const deleteColors = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.color.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/color/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportColors() {
    try {
        const colors = await prisma.color.findMany({});

        // Format data for Excel
        const formattedData = colors.map((color) => ({
            Name: color.name,
            Hex: color.hex,
            CreatedAt: color.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export colors error:', error);
        return { success: false, error: 'Failed to export colors' };
    }
}
