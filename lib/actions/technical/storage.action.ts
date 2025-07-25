'use server';

import { messages } from '@/lib/messages';
import prisma from '@/lib/prisma';
import { StorageSchema } from '@/lib/validation/technical/storage.form';
import { Storage } from '@/types/prisma';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getStorages = async () => {
    try {
        const storages = await prisma.storage.findMany({});
        return storages;
    } catch (error) {
        console.error(error);
    }
};

export const getStorageById = async (storageId: string) => {
    try {
        const storage = await prisma.storage.findUnique({
            where: { id: storageId },
        });
        if (!storage) {
            throw new Error('storage not found');
        }
        return storage;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createStorage = async (currentState: CurrentState, data: StorageSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].StorageForm;

    try {
        // Tạo Storage mới
        await prisma.storage.create({
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
                message: t.storageNameExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateStorage = async (currentState: CurrentState, data: StorageSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].StorageForm;
    try {
        // Cập nhật storage
        await prisma.storage.update({
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
                message: t.storageNameExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const deleteStorage = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Storage ID is required');
        }

        await prisma.storage.delete({
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

export const deleteStorages = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.storage.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/storage/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportStorages() {
    try {
        const storages = await prisma.storage.findMany({});

        // Format data for Excel
        const formattedData = storages.map((storage: Storage) => ({
            Name: storage.name,
            CreatedAt: storage.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export storages error:', error);
        return { success: false, error: 'Failed to export storages' };
    }
}
