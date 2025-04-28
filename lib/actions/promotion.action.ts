/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '@/lib/prisma';
import { PromotionSchema } from '../validation/promotion.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

const getStatusId = async (statusName: string) => {
    let status = await prisma.status.findUnique({ where: { name: statusName } });
    if (!status) {
        status = await prisma.status.create({
            data: { name: statusName, createdDate: new Date() },
        });
    }
    return status.id;
};

const isPromotionExpired = (promotion: any): boolean => {
    const now = new Date();
    if (promotion.durationType === 'date' && promotion.endDate) {
        return now > new Date(promotion.endDate);
    } else if (promotion.durationType === 'hours' && promotion.endHours !== null) {
        const currentHours = now.getHours();
        return currentHours >= promotion.endHours;
    } else if (promotion.durationType === 'minutes' && promotion.endMinutes !== null) {
        const currentMinutes = now.getMinutes();
        return currentMinutes >= promotion.endMinutes;
    } else if (promotion.durationType === 'seconds' && promotion.endSeconds !== null) {
        const currentSeconds = now.getSeconds();
        return currentSeconds >= promotion.endSeconds;
    }
    return false;
};

const calculateRemainingTime = (promotion: any): number => {
    if (promotion.durationType === 'date' && promotion.startDate && promotion.endDate) {
        const diff = new Date(promotion.endDate).getTime() - new Date(promotion.startDate).getTime();
        return Math.floor(diff / 1000); // Convert to seconds
    } else if (promotion.durationType === 'hours' && promotion.startHours !== null && promotion.endHours !== null) {
        return (promotion.endHours - promotion.startHours) * 3600; // Convert hours to seconds
    } else if (
        promotion.durationType === 'minutes' &&
        promotion.startMinutes !== null &&
        promotion.endMinutes !== null
    ) {
        return (promotion.endMinutes - promotion.startMinutes) * 60; // Convert minutes to seconds
    } else if (
        promotion.durationType === 'seconds' &&
        promotion.startSeconds !== null &&
        promotion.endSeconds !== null
    ) {
        return promotion.endSeconds - promotion.startSeconds; // Already in seconds
    }
    return 0;
};

export const getPromotions = async () => {
    try {
        const promotions = await prisma.promotion.findMany({});
        return promotions;
    } catch (error) {
        console.error(error);
    }
};

export const createPromotion = async (currentState: CurrentState, data: PromotionSchema) => {
    try {
        const percentageSave = Number(100 - data.percentageNumber);
        const discountMultiplier = data.percentageNumber / 100;

        const productIds = data.productIds || [];
        let categoryProductIds: string[] = [];

        if (data.categoryIds?.length) {
            const productsInCategories = await prisma.product.findMany({
                where: { categoryId: { in: data.categoryIds } },
                select: { id: true },
            });
            categoryProductIds = productsInCategories.map((p) => p.id);
        }

        const allProductIds = Array.from(new Set([...productIds, ...categoryProductIds])).filter(
            (id): id is string => id !== undefined && id !== null,
        );

        if (allProductIds.length === 0 && (!data.categoryIds || data.categoryIds.length === 0)) {
            return {
                success: false,
                error: true,
                message: 'No products or categories selected for the promotion',
            };
        }

        const products = await prisma.product.findMany({
            where: { id: { in: allProductIds } },
            select: { id: true, price: true },
        });

        await Promise.all(
            products.map((product) =>
                prisma.product.update({
                    where: { id: product.id },
                    data: { priceWithDiscount: product.price * (1 - discountMultiplier) },
                }),
            ),
        );

        const statusId = await getStatusId('In deals');
        const promotionData: any = {
            name: data.name,
            percentageNumber: Number(data.percentageNumber),
            percentageSave,
            durationType: data.durationType,
            isActive: true,
            statusId,
            products: { connect: allProductIds.map((id) => ({ id })) },
            categories: { connect: data.categoryIds?.map((id) => ({ id })) || [] },
        };

        if (data.durationType === 'date') {
            promotionData.startDate = new Date(data.startDate!);
            promotionData.endDate = new Date(data.endDate!);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
        } else if (data.durationType === 'hours') {
            promotionData.startHours = Number(data.startHours);
            promotionData.endHours = Number(data.endHours);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
        } else if (data.durationType === 'minutes') {
            promotionData.startMinutes = Number(data.startMinutes);
            promotionData.endMinutes = Number(data.endMinutes);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
        } else if (data.durationType === 'seconds') {
            promotionData.startSeconds = Number(data.startSeconds);
            promotionData.endSeconds = Number(data.endSeconds);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
        }

        await prisma.promotion.create({
            data: promotionData,
            include: { products: true },
        });

        return { success: true, error: false };
    } catch (error: any) {
        console.error('Create promotion error:', error);
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Promotion name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to create promotion' };
    }
};

export const updatePromotion = async (currentState: CurrentState, data: PromotionSchema) => {
    try {
        if (!data.id) {
            throw new Error('Promotion ID is required for update');
        }

        const percentageSave = Number(100 - data.percentageNumber);
        const discountMultiplier = data.percentageNumber / 100;

        const productIds = data.productIds || [];
        let categoryProductIds: string[] = [];

        if (data.categoryIds?.length) {
            const productsInCategories = await prisma.product.findMany({
                where: { categoryId: { in: data.categoryIds } },
                select: { id: true },
            });
            categoryProductIds = productsInCategories.map((p) => p.id);
        }

        const allProductIds = new Set([...productIds, ...categoryProductIds]);
        const filteredProductIds = Array.from(allProductIds).filter(
            (id): id is string => id !== undefined && id !== null,
        );

        const existingPromotion = await prisma.promotion.findUnique({
            where: { id: data.id },
            include: { products: true, categories: true },
        });
        const existingProductIds = existingPromotion?.products.map((p) => p.id) || [];
        const productsToReset = existingProductIds.filter((id) => !allProductIds.has(id));

        await Promise.all(
            productsToReset.map((productId) =>
                prisma.product.update({
                    where: { id: productId },
                    data: { priceWithDiscount: null },
                }),
            ),
        );

        const products = await prisma.product.findMany({
            where: { id: { in: filteredProductIds } },
            select: { id: true, price: true },
        });

        await Promise.all(
            products.map((product) =>
                prisma.product.update({
                    where: { id: product.id },
                    data: { priceWithDiscount: product.price * (1 - discountMultiplier) },
                }),
            ),
        );

        const statusId = await getStatusId('In deals');
        const promotionData: any = {
            name: data.name,
            percentageNumber: Number(data.percentageNumber),
            percentageSave,
            durationType: data.durationType,
            isActive: true,
            statusId,
            products: { set: Array.from(allProductIds).map((id) => ({ id })) },
            categories: { set: data.categoryIds?.map((id) => ({ id })) || [] },
        };

        if (data.durationType === 'date') {
            promotionData.startDate = new Date(data.startDate!);
            promotionData.endDate = new Date(data.endDate!);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
            promotionData.startHours = null;
            promotionData.endHours = null;
            promotionData.startMinutes = null;
            promotionData.endMinutes = null;
            promotionData.startSeconds = null;
            promotionData.endSeconds = null;
        } else if (data.durationType === 'hours') {
            promotionData.startHours = Number(data.startHours);
            promotionData.endHours = Number(data.endHours);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
            promotionData.startDate = null;
            promotionData.endDate = null;
            promotionData.startMinutes = null;
            promotionData.endMinutes = null;
            promotionData.startSeconds = null;
            promotionData.endSeconds = null;
        } else if (data.durationType === 'minutes') {
            promotionData.startMinutes = Number(data.startMinutes);
            promotionData.endMinutes = Number(data.endMinutes);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
            promotionData.startDate = null;
            promotionData.endDate = null;
            promotionData.startHours = null;
            promotionData.endHours = null;
            promotionData.startSeconds = null;
            promotionData.endSeconds = null;
        } else if (data.durationType === 'seconds') {
            promotionData.startSeconds = Number(data.startSeconds);
            promotionData.endSeconds = Number(data.endSeconds);
            promotionData.remainingTime = calculateRemainingTime(promotionData);
            promotionData.startDate = null;
            promotionData.endDate = null;
            promotionData.startHours = null;
            promotionData.endHours = null;
            promotionData.startMinutes = null;
            promotionData.endMinutes = null;
        }

        await prisma.promotion.update({
            where: { id: data.id },
            data: promotionData,
        });

        return { success: true, error: false };
    } catch (error: any) {
        console.error('Update promotion error:', error);
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Promotion name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to update promotion' };
    }
};

export const deletePromotion = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Promotion ID is required');
        }

        const promotion = await prisma.promotion.findUnique({
            where: { id },
            include: { products: true },
        });

        const productIds = promotion?.products.map((p) => p.id) || [];

        await Promise.all(
            productIds.map(async (productId) => {
                try {
                    const otherPromotions = await prisma.promotion.findMany({
                        where: {
                            id: { not: id },
                            products: { some: { id: productId } },
                        },
                    });

                    if (otherPromotions.length === 0) {
                        await prisma.product.update({
                            where: { id: productId },
                            data: { priceWithDiscount: null },
                        });
                    }
                } catch (error) {
                    console.error(`Failed to process product ${productId}:`, error);
                }
            }),
        );

        await prisma.promotion.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error('Delete promotion error:', error);
        return { success: false, error: true, message: 'Failed to delete promotion' };
    }
};

export const deletePromotions = async (currentState: CurrentState, ids: string[]) => {
    try {
        const promotions = await prisma.promotion.findMany({
            where: { id: { in: ids } },
            include: { products: true },
        });

        const productIds = Array.from(new Set(promotions.flatMap((p) => p.products.map((prod) => prod.id))));

        await Promise.all(
            productIds.map(async (productId) => {
                try {
                    const otherPromotions = await prisma.promotion.findMany({
                        where: {
                            id: { notIn: ids },
                            products: { some: { id: productId } },
                        },
                    });

                    if (otherPromotions.length === 0) {
                        await prisma.product.update({
                            where: { id: productId },
                            data: { priceWithDiscount: null },
                        });
                    }
                } catch (error) {
                    console.error(`Failed to process product ${productId}:`, error);
                }
            }),
        );

        await prisma.promotion.deleteMany({
            where: { id: { in: ids } },
        });
        return { success: true, error: false };
    } catch (error) {
        console.error('Delete promotions error:', error);
        return { success: false, error: true, message: 'Failed to delete promotions' };
    }
};

export async function exportPromotions() {
    try {
        const promotions = await prisma.promotion.findMany({
            include: {
                products: true,
                categories: true,
            },
        });

        const formattedData = promotions.map((promotion) => ({
            Name: promotion.name,
            CreatedAt: promotion.createdDate.toISOString(),
            PercentageNumber: promotion.percentageNumber,
            DurationType: promotion.durationType,
            RemainingTime: promotion.remainingTime,
            Products: promotion.products.map((p) => p.name).join(', '),
            Categories: promotion.categories.map((c) => c.name).join(', '),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export promotions error:', error);
        return { success: false, error: 'Failed to export promotions' };
    }
}

// Background job to check for expired promotions
export const updatePromotionCountdown = async () => {
    try {
        const promotions = await prisma.promotion.findMany({
            where: { isActive: true },
            include: { products: true, status: true },
        });

        const outOfDealsStatusId = await getStatusId('Out of deals');

        await prisma.$transaction(
            promotions.map((promotion) =>
                prisma.promotion.update({
                    where: { id: promotion.id },
                    data: {
                        remainingTime: {
                            decrement: 1,
                        },
                        isActive: {
                            set: promotion.remainingTime && promotion.remainingTime > 1 ? true : false,
                        },
                        statusId: {
                            set:
                                promotion.remainingTime && promotion.remainingTime > 1
                                    ? promotion.statusId
                                    : outOfDealsStatusId,
                        },
                    },
                }),
            ),
        );

        // Reset priceWithDiscount for expired promotions
        const expiredPromotions = promotions.filter(
            (promotion) => promotion.remainingTime && promotion.remainingTime <= 1,
        );

        await Promise.all(
            expiredPromotions.map(async (promotion) => {
                await prisma.product.updateMany({
                    where: { promotions: { some: { id: promotion.id } } },
                    data: { priceWithDiscount: null },
                });
            }),
        );

        console.log(`Updated ${promotions.length} active promotions`);
    } catch (error) {
        console.error('Update promotion countdown error:', error);
    }
};

// Server action to expire a promotion
export const expirePromotion = async (promotionId: string) => {
    try {
        const outOfDealsStatusId = await getStatusId('Out of deals');
        await prisma.promotion.update({
            where: { id: promotionId },
            data: { isActive: false, statusId: outOfDealsStatusId },
        });
        await prisma.product.updateMany({
            where: { promotions: { some: { id: promotionId } } },
            data: { priceWithDiscount: null },
        });
        return { success: true };
    } catch (error) {
        console.error('Expire promotion error:', error);
        return { success: false, error: 'Failed to expire promotion' };
    }
};
