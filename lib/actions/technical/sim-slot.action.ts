'use server';

import { messages } from '@/lib/messages';
import prisma from '@/lib/prisma';
import { SimSlotSchema } from '@/lib/validation/technical/sim-slot.form';
import { SimSlot } from '@/types/prisma';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getSimSlots = async () => {
    try {
        const simSlots = await prisma.simSlot.findMany({});
        return simSlots;
    } catch (error) {
        console.error(error);
    }
};

export const getSimSlotById = async (simSlotId: string) => {
    try {
        const simSlot = await prisma.simSlot.findUnique({
            where: { id: simSlotId },
        });
        if (!simSlot) {
            throw new Error('simSlot not found');
        }
        return simSlot;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createSimSlot = async (currentState: CurrentState, data: SimSlotSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].SimSlotForm;
    try {
        // Tạo SimSlot mới
        await prisma.simSlot.create({
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

export const updateSimSlot = async (currentState: CurrentState, data: SimSlotSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].SimSlotForm;
    try {
        // Cập nhật SimSlot
        await prisma.simSlot.update({
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

export const deleteSimSlot = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Sim slot ID is required');
        }

        await prisma.simSlot.delete({
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

export const deleteSimSlots = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.simSlot.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/sim-slot/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportSimSlots() {
    try {
        const simSlots = await prisma.simSlot.findMany({});

        // Format data for Excel
        const formattedData = simSlots.map((simSlot: SimSlot) => ({
            Title: simSlot.title,
            CreatedAt: simSlot.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export simSlots error:', error);
        return { success: false, error: 'Failed to export simSlots' };
    }
}
