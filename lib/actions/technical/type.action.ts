'use server';

import { messages } from '@/lib/messages';
import prisma from '@/lib/prisma';
import { TypeSchema } from '@/lib/validation/technical/type.form';
import { Type } from '@/types/prisma';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getTypes = async () => {
    try {
        const types = await prisma.type.findMany({});
        return types;
    } catch (error) {
        console.error(error);
    }
};

export const getTypeById = async (typeId: string) => {
    try {
        const type = await prisma.type.findUnique({
            where: { id: typeId },
        });
        if (!type) {
            throw new Error('type not found');
        }
        return type;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createType = async (currentState: CurrentState, data: TypeSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].TypeForm;
    try {
        // Tạo Type mới
        await prisma.type.create({
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
                message: t.typeNameExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateType = async (currentState: CurrentState, data: TypeSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].TypeForm;
    try {
        // Cập nhật Type
        await prisma.type.update({
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
                message: t.typeNameExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const deleteType = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Type ID is required');
        }

        await prisma.type.delete({
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

export const deleteTypes = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.type.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/type/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportTypes() {
    try {
        const types = await prisma.type.findMany({});

        // Format data for Excel
        const formattedData = types.map((type: Type) => ({
            Name: type.name,
            CreatedAt: type.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export types error:', error);
        return { success: false, error: 'Failed to export types' };
    }
}
