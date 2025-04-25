/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '../prisma';
import { RoleSchema } from '../validation/role.form';

type CurrentState = { success: boolean; error: boolean };

export const getRoles = async () => {
    try {
        const roles = await prisma.role.findMany({});
        return roles;
    } catch (error) {
        console.error(error);
    }
};

export const createRole = async (currentState: CurrentState, data: RoleSchema) => {
    try {
        await prisma.role.create({
            data: {
                name: data.name,
            },
        });

        // revalidatePath('/list/roles');
        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Role name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to create role' };
    }
};

export const updateRole = async (currentState: CurrentState, data: RoleSchema) => {
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
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Role name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to update role' };
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
