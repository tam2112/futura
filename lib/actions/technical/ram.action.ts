'use server';

import { messages } from '@/lib/messages';
import prisma from '@/lib/prisma';
import { RamSchema } from '@/lib/validation/technical/ram.form';
import { Ram } from '@/types/prisma';
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

export const createRam = async (currentState: CurrentState, data: RamSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].RamForm;
    try {
        // Tạo Ram mới
        await prisma.ram.create({
            data: {
                title: data.title,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: t.titleExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateRam = async (currentState: CurrentState, data: RamSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].RamForm;
    try {
        // Cập nhật Ram
        await prisma.ram.update({
            where: { id: data.id },
            data: {
                title: data.title,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: t.titleExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
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
        const formattedData = rams.map((ram: Ram) => ({
            Title: ram.title,
            CreatedAt: ram.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export rams error:', error);
        return { success: false, error: 'Failed to export rams' };
    }
}
