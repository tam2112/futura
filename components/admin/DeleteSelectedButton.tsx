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

export async function deleteSelectedProducts(selectedIds: string[]) {
    try {
        const count = await prisma.product.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting products:', error);
        return { success: false, error: 'Failed to delete products' };
    }
}

export async function deleteSelectedPromotions(selectedIds: string[]) {
    try {
        const count = await prisma.promotion.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting promotions:', error);
        return { success: false, error: 'Failed to delete promotions' };
    }
}

export async function deleteSelectedUsers(selectedIds: string[]) {
    try {
        const count = await prisma.user.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting users:', error);
        return { success: false, error: 'Failed to delete users' };
    }
}

export async function deleteSelectedRoles(selectedIds: string[]) {
    try {
        const count = await prisma.role.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting roles:', error);
        return { success: false, error: 'Failed to delete roles' };
    }
}

export async function deleteSelectedBrands(selectedIds: string[]) {
    try {
        const count = await prisma.brand.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting brands:', error);
        return { success: false, error: 'Failed to delete brands' };
    }
}

export async function deleteSelectedColors(selectedIds: string[]) {
    try {
        const count = await prisma.color.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting colors:', error);
        return { success: false, error: 'Failed to delete colors' };
    }
}

export async function deleteSelectedStorages(selectedIds: string[]) {
    try {
        const count = await prisma.storage.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting storages:', error);
        return { success: false, error: 'Failed to delete storages' };
    }
}

export async function deleteSelectedConnectivities(selectedIds: string[]) {
    try {
        const count = await prisma.connectivity.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting connectivities:', error);
        return { success: false, error: 'Failed to delete connectivities' };
    }
}

export async function deleteSelectedSimSlots(selectedIds: string[]) {
    try {
        const count = await prisma.simSlot.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting simSlots:', error);
        return { success: false, error: 'Failed to delete simSlots' };
    }
}

export async function deleteSelectedBatteryHealths(selectedIds: string[]) {
    try {
        const count = await prisma.batteryHealth.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting batteryHealths:', error);
        return { success: false, error: 'Failed to delete batteryHealths' };
    }
}

export async function deleteSelectedRams(selectedIds: string[]) {
    try {
        const count = await prisma.ram.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting rams:', error);
        return { success: false, error: 'Failed to delete rams' };
    }
}

export async function deleteSelectedCpus(selectedIds: string[]) {
    try {
        const count = await prisma.cpu.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting cpus:', error);
        return { success: false, error: 'Failed to delete cpus' };
    }
}

export async function deleteSelectedScreenSizes(selectedIds: string[]) {
    try {
        const count = await prisma.screenSize.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting screenSizes:', error);
        return { success: false, error: 'Failed to delete screenSizes' };
    }
}

export async function deleteSelectedTypes(selectedIds: string[]) {
    try {
        const count = await prisma.type.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting types:', error);
        return { success: false, error: 'Failed to delete types' };
    }
}

export async function deleteSelectedStatuses(selectedIds: string[]) {
    try {
        const count = await prisma.status.deleteMany({
            where: {
                id: {
                    in: selectedIds,
                },
            },
        });

        return { success: true, count: count.count };
    } catch (error) {
        console.error('Error deleting statuses:', error);
        return { success: false, error: 'Failed to delete statuses' };
    }
}
