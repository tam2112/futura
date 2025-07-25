'use server';

import { messages } from '@/lib/messages';
import prisma from '@/lib/prisma';
import { CpuSchema } from '@/lib/validation/technical/cpu.form';
import { Cpu } from '@/types/prisma';
import { revalidatePath } from 'next/cache';

type CurrentState = { success: boolean; error: boolean };

export const getCpus = async () => {
    try {
        const cpus = await prisma.cpu.findMany({});
        return cpus;
    } catch (error) {
        console.error(error);
    }
};

export const getCpuById = async (cpuId: string) => {
    try {
        const cpu = await prisma.cpu.findUnique({
            where: { id: cpuId },
        });
        if (!cpu) {
            throw new Error('cpu not found');
        }
        return cpu;
    } catch (error) {
        console.error(error);
        throw error; // Or return { success: false, error: true }
    }
};

export const createCpu = async (currentState: CurrentState, data: CpuSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].CpuForm;
    try {
        await prisma.cpu.create({
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
                message: t.cpuNameExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateCpu = async (currentState: CurrentState, data: CpuSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].CpuForm;
    try {
        await prisma.cpu.update({
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
                message: t.cpuNameExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const deleteCpu = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Cpu ID is required');
        }

        await prisma.cpu.delete({
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

export const deleteCpus = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.cpu.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/technical/cpu/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportCpus() {
    try {
        const cpus = await prisma.cpu.findMany({});

        // Format data for Excel
        const formattedData = cpus.map((cpu: Cpu) => ({
            Name: cpu.name,
            CreatedAt: cpu.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export cpus error:', error);
        return { success: false, error: 'Failed to export cpus' };
    }
}
