/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '@/lib/prisma';
import { BatteryHealthSchema } from '@/lib/validation/technical/battery-health.form';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getBatteryHealths = async () => {
    try {
        const batteryHealths = await prisma.batteryHealth.findMany({});
        return batteryHealths;
    } catch (error) {
        console.error(error);
    }
};

export const getBatteryHealthById = async (batteryHealthId: string) => {
    try {
        const batteryHealth = await prisma.batteryHealth.findUnique({
            where: { id: batteryHealthId },
        });
        if (!batteryHealth) {
            throw new Error('batteryHealth not found');
        }
        return batteryHealth;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createBatteryHealth = async (currentState: CurrentState, data: BatteryHealthSchema) => {
    try {
        // Tạo batteryHealth mới
        await prisma.batteryHealth.create({
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
        return { success: false, error: true, message: 'Failed to create battery health' };
    }
};

export const updateBatteryHealth = async (currentState: CurrentState, data: BatteryHealthSchema) => {
    try {
        // Cập nhật BatteryHealth
        await prisma.batteryHealth.update({
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
        return { success: false, error: true, message: 'Failed to update battery health' };
    }
};

export const deleteBatteryHealth = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Battery Health ID is required');
        }

        await prisma.batteryHealth.delete({
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

export const deleteBatteryHealths = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.batteryHealth.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/battery-health/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportBatteryHealths() {
    try {
        const batteryHealths = await prisma.batteryHealth.findMany({});

        // Format data for Excel
        const formattedData = batteryHealths.map((batteryHealth) => ({
            Title: batteryHealth.title,
            CreatedAt: batteryHealth.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export batteryHealths error:', error);
        return { success: false, error: 'Failed to export batteryHealths' };
    }
}
