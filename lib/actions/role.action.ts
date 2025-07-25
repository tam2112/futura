'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { RoleSchema } from '../validation/role.form';
import { messages } from '../messages';
import { Role } from '@/types/prisma';

type CurrentState = { success: boolean; error: boolean };

export const getRoles = async () => {
    try {
        const roles = await prisma.role.findMany({});
        return roles;
    } catch (error) {
        console.error(error);
    }
};

export const createRole = async (currentState: CurrentState, data: RoleSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].RoleForm;

    try {
        await prisma.role.create({
            data: {
                name: data.name,
            },
        });

        // revalidatePath('/list/roles');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: t.roleNameExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateRole = async (currentState: CurrentState, data: RoleSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].RoleForm;

    try {
        await prisma.role.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
            },
        });

        // revalidatePath('/list/categories');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: t.roleNameExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const deleteRole = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        await prisma.role.delete({
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

export const deleteRoles = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.role.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/role/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportRoles() {
    try {
        const roles = await prisma.role.findMany({});

        // Format data for Excel
        const formattedData = roles.map((role: Role) => ({
            Name: role.name,
            CreatedAt: role.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export roles error:', error);
        return { success: false, error: 'Failed to export roles' };
    }
}
