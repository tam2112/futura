'use server';

import { messages } from '@/lib/messages';
import prisma from '@/lib/prisma';
import { ConnectivitySchema } from '@/lib/validation/technical/connectivity.form';
import { Connectivity } from '@/types/prisma';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getConnectivities = async () => {
    try {
        const connectivities = await prisma.connectivity.findMany({});
        return connectivities;
    } catch (error) {
        console.error(error);
    }
};

export const getConnectivityById = async (connectivityId: string) => {
    try {
        const connectivity = await prisma.connectivity.findUnique({
            where: { id: connectivityId },
        });
        if (!connectivity) {
            throw new Error('connectivity not found');
        }
        return connectivity;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createConnectivity = async (
    currentState: CurrentState,
    data: ConnectivitySchema & { locale?: 'en' | 'vi' },
) => {
    const locale = data.locale || 'en';
    const t = messages[locale].ConnectivityForm;
    try {
        // Tạo Connectivity mới
        await prisma.connectivity.create({
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
                message: t.connectivityNameExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateConnectivity = async (
    currentState: CurrentState,
    data: ConnectivitySchema & { locale?: 'en' | 'vi' },
) => {
    const locale = data.locale || 'en';
    const t = messages[locale].ConnectivityForm;
    try {
        // Cập nhật Connectivity
        await prisma.connectivity.update({
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
                message: t.connectivityNameExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const deleteConnectivity = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Connectivity ID is required');
        }

        await prisma.connectivity.delete({
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

export const deleteConnectivities = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.connectivity.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/connectivity/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportConnectivities() {
    try {
        const connectivities = await prisma.connectivity.findMany({});

        // Format data for Excel
        const formattedData = connectivities.map((connectivity: Connectivity) => ({
            Name: connectivity.name,
            CreatedAt: connectivity.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export connectivities error:', error);
        return { success: false, error: 'Failed to export connectivities' };
    }
}
