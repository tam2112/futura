/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '@/lib/prisma';
import { RamSchema } from '@/lib/validation/technical/ram.form';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getRams = async () => {
    try {
        const rams = await prisma.ram.findMany({});
        return rams;
    } catch (error) {
        console.error(error);
    }
};

export const getRamById = async (ramId: string) => {
    try {
        const ram = await prisma.ram.findUnique({
            where: { id: ramId },
        });
        if (!ram) {
            throw new Error('ram not found');
        }
        return ram;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createRam = async (currentState: CurrentState, data: RamSchema) => {
    try {
        // Tạo Ram mới
        await prisma.ram.create({
            data: {
                title: data.title,
            },
        });

        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Title already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to create RAM' };
    }
};

export const updateRam = async (currentState: CurrentState, data: RamSchema) => {
    try {
        // Cập nhật Ram
        await prisma.ram.update({
            where: { id: data.id },
            data: {
                title: data.title,
            },
        });

        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Title already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to update RAM' };
    }
};

export const deleteRam = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Ram ID is required');
        }

        await prisma.ram.delete({
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

export const deleteRams = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.ram.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/ram/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportRams() {
    try {
        const rams = await prisma.ram.findMany({});

        // Format data for Excel
        const formattedData = rams.map((ram) => ({
            Title: ram.title,
            CreatedAt: ram.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export rams error:', error);
        return { success: false, error: 'Failed to export rams' };
    }
}
