'use server';

import prisma from '@/lib/prisma';

export async function deleteSelectedCategories(selectedIds: string[]) {
    try {
        const count = await prisma.category.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting categories:', error);
        return { success: false, error: 'Failed to delete categories' };
    }
}
