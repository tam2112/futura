'use server';

import prisma from '@/lib/prisma';
import { ScreenSizeSchema } from '@/lib/validation/technical/screen-size.form';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getScreenSizes = async () => {
    try {
        const screenSizes = await prisma.screenSize.findMany({});
        return screenSizes;
    } catch (error) {
        console.error(error);
    }
};

export const getScreenSizeById = async (screenSizeId: string) => {
    try {
        const screenSize = await prisma.screenSize.findUnique({
            where: { id: screenSizeId },
        });
        if (!screenSize) {
            throw new Error('screenSize not found');
        }
        return screenSize;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createScreenSize = async (currentState: CurrentState, data: ScreenSizeSchema) => {
    try {
        // Tạo ScreenSize mới
        await prisma.screenSize.create({
            data: {
                name: data.name,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const updateScreenSize = async (currentState: CurrentState, data: ScreenSizeSchema) => {
    try {
        // Cập nhật ScreenSize
        await prisma.screenSize.update({
            where: { id: data.id },
            data: {
                name: data.name,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const deleteScreenSize = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('ScreenSize ID is required');
        }

        await prisma.screenSize.delete({
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

export const deleteScreenSizes = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.screenSize.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/screen-size/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportScreenSizes() {
    try {
        const screenSizes = await prisma.screenSize.findMany({});

        // Format data for Excel
        const formattedData = screenSizes.map((screenSize) => ({
            Name: screenSize.name,
            CreatedAt: screenSize.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export screenSizes error:', error);
        return { success: false, error: 'Failed to export screenSizes' };
    }
}
