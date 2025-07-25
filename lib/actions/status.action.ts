'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { StatusSchema } from '../validation/status.form';
import { messages } from '../messages';
import { Status } from '@/types/prisma';

type CurrentState = { success: boolean; error: boolean };

export const getStatuses = async () => {
    try {
        const statuses = await prisma.status.findMany({});
        return statuses;
    } catch (error) {
        console.error(error);
    }
};

export const getStatusById = async (statusId: string) => {
    try {
        const status = await prisma.status.findUnique({
            where: { id: statusId },
        });
        if (!status) {
            throw new Error('status not found');
        }
        return status;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createStatus = async (currentState: CurrentState, data: StatusSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].StatusForm;

    try {
        await prisma.status.create({
            data: {
                name: data.name,
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
                message: t.statusNameExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateStatus = async (currentState: CurrentState, data: StatusSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].StatusForm;

    try {
        await prisma.status.update({
            where: { id: data.id },
            data: {
                name: data.name,
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
                message: t.statusNameExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const deleteStatus = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Status ID is required');
        }

        await prisma.status.delete({
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

export const deleteStatuses = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.status.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/status/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportStatuses() {
    try {
        const statuses = await prisma.status.findMany({});

        // Format data for Excel
        const formattedData = statuses.map((status: Status) => ({
            Name: status.name,
            CreatedAt: status.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export statuses error:', error);
        return { success: false, error: 'Failed to export statuses' };
    }
}
