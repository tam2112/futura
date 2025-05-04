/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { generateSlug } from '../utils';
import { ProductSchema } from '../validation/product.form';

type CurrentState = { success: boolean; error: boolean };

export const getProducts = async () => {
    try {
        const products = await prisma.product.findMany({
            include: {
                images: {
                    select: { url: true },
                },
            },
        });
        return products;
    } catch (error) {
        console.error(error);
    }
};

export const getProductsByCategorySlug = async (slug: string) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: {
                    slug,
                },
            },
            include: {
                images: {
                    select: { url: true },
                },
                category: {
                    select: { name: true, slug: true },
                },
                brand: {
                    select: { name: true, id: true },
                },
                color: {
                    select: { name: true, hex: true, id: true },
                },
                storage: {
                    select: { name: true, id: true },
                },
                connectivity: {
                    select: { name: true, id: true },
                },
                simSlot: {
                    select: { title: true, id: true },
                },
                batteryHealth: {
                    select: { title: true, id: true },
                },
                ram: {
                    select: { title: true, id: true },
                },
                cpu: {
                    select: { name: true, id: true },
                },
                screenSize: {
                    select: { name: true, id: true },
                },
                type: {
                    select: { name: true, id: true },
                },
                status: {
                    select: { name: true },
                },
                promotions: { select: { percentageNumber: true } },
            },
        });
        return products;
    } catch (error) {
        console.error('Error fetching products by category slug:', error);
        return [];
    }
};

export const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true } },
                brand: { select: { name: true, id: true } },
                color: { select: { name: true, hex: true, id: true } },
                storage: { select: { name: true, id: true } },
                connectivity: { select: { name: true, id: true } },
                simSlot: { select: { title: true, id: true } },
                batteryHealth: { select: { title: true, id: true } },
                ram: { select: { title: true, id: true } },
                cpu: { select: { name: true, id: true } },
                screenSize: { select: { name: true, id: true } },
                type: { select: { name: true, id: true } },
                status: { select: { name: true } },
                promotions: { select: { percentageNumber: true } },
            },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return null;
    }
};

export const getRelatedProducts = async (categorySlug: string, excludeProductId: string, limit: number = 8) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: { slug: categorySlug },
                id: { not: excludeProductId },
            },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true } },
                brand: { select: { name: true, id: true } },
                color: { select: { name: true, hex: true, id: true } },
                storage: { select: { name: true, id: true } },
                connectivity: { select: { name: true, id: true } },
                simSlot: { select: { title: true, id: true } },
                batteryHealth: { select: { title: true, id: true } },
                ram: { select: { title: true, id: true } },
                cpu: { select: { name: true, id: true } },
                screenSize: { select: { name: true, id: true } },
                type: { select: { name: true, id: true } },
                status: { select: { name: true } },
            },
            take: limit,
        });
        return products;
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
};

// Fetch 10 newest products (New Arrivals)
export const getNewArrivals = async (limit: number = 10) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdDate: 'desc',
            },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true } },
                brand: { select: { name: true, id: true } },
            },
            take: limit,
        });
        return products;
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        return [];
    }
};

// Fetch 8 random Apple smartphones (Popular iPhones)
export const getPopularIPhones = async (limit: number = 8) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                category: { slug: 'smartphones' },
                brand: { name: 'Apple' },
            },
            orderBy: {
                createdDate: 'desc', // Optional: You can remove this if you want truly random
            },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true } },
                brand: { select: { name: true, id: true } },
            },
            take: limit,
        });
        // Shuffle products for randomness
        return products.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error fetching popular iPhones:', error);
        return [];
    }
};

// Fetch 8 random laptops (Popular Laptops)
export const getPopularLaptops = async (limit: number = 8) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                category: { slug: 'laptops' },
            },
            orderBy: {
                createdDate: 'desc', // Optional: You can remove this if you want truly random
            },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true } },
                brand: { select: { name: true, id: true } },
            },
            take: limit,
        });
        // Shuffle products for randomness
        return products.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error fetching popular laptops:', error);
        return [];
    }
};

// Fetch 8 random tablets (Trending iPads)
export const getTrendingIPads = async (limit: number = 8) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                category: { slug: 'tablets' },
            },
            orderBy: {
                createdDate: 'desc', // Optional: You can remove this if you want truly random
            },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true } },
                brand: { select: { name: true, id: true } },
            },
            take: limit,
        });
        // Shuffle products for randomness
        return products.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error fetching trending iPads:', error);
        return [];
    }
};

export const getDealProducts = async (limit?: number) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                priceWithDiscount: { not: null },
                isActive: true,
            },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true, id: true } },
                brand: { select: { name: true, id: true } },
                promotions: { select: { percentageNumber: true } },
            },
            orderBy: [{ priceWithDiscount: 'asc' }, { createdDate: 'desc' }],
            take: limit,
        });
        return products;
    } catch (error) {
        console.error('Error fetching deal products:', error);
        return [];
    }
};

export const getRandomProductsByBrand = async (brandName: string, limit: number = 4) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                brand: { name: brandName },
            },
            include: {
                images: { select: { url: true } },
                category: { select: { name: true, slug: true } },
                brand: { select: { name: true, id: true } },
            },
            take: limit * 2, // Fetch more to ensure enough for randomization
        });
        // Shuffle and limit to the requested number
        return products.sort(() => Math.random() - 0.5).slice(0, limit);
    } catch (error) {
        console.error(`Error fetching random products for brand ${brandName}:`, error);
        return [];
    }
};

// export const getCategoryById = async (categoryId: string) => {
//     try {
//         const category = await prisma.category.findUnique({
//             where: { id: categoryId },
//             include: { images: true },
//         });
//         if (!category) {
//             throw new Error('Category not found');
//         }
//         return category;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const createProduct = async (currentState: CurrentState, data: ProductSchema & { imageUrls?: string[] }) => {
    try {
        const slug = generateSlug(data.name);

        // Determine status based on quantity
        const statusName = Number(data.quantity) > 0 ? 'In stock' : 'Out of stock';
        const isActive = Number(data.quantity) > 0;

        // Find or create the status
        let status = await prisma.status.findFirst({
            where: { name: statusName },
        });

        if (!status) {
            status = await prisma.status.create({
                data: {
                    name: statusName,
                    createdDate: new Date(),
                },
            });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                price: Number(data.price),
                quantity: Number(data.quantity),
                isActive,
                statusId: status.id,
                categoryId: data.categoryId,
                brandId: data.brandId || null,
                colorId: data.colorId || null,
                storageId: data.storageId || null,
                connectivityId: data.connectivityId || null,
                simSlotId: data.simSlotId || null,
                batteryHealthId: data.batteryHealthId || null,
                ramId: data.ramId || null,
                cpuId: data.cpuId || null,
                screenSizeId: data.screenSizeId || null,
                typeId: data.typeId || null,
            },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    productId: newProduct.id,
                    createdDate: new Date(),
                })),
            });
        }

        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Product name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to create product' };
    }
};

export const updateProduct = async (currentState: CurrentState, data: ProductSchema & { imageUrls?: string[] }) => {
    try {
        if (!data.id) {
            throw new Error('Product ID is required for update');
        }

        const newSlug = generateSlug(data.name);

        // Determine status based on quantity
        const statusName = Number(data.quantity) > 0 ? 'In stock' : 'Out of stock';
        const isActive = Number(data.quantity) > 0;

        // Find or create the status
        let status = await prisma.status.findFirst({
            where: { name: statusName },
        });

        if (!status) {
            status = await prisma.status.create({
                data: {
                    name: statusName,
                    createdDate: new Date(),
                },
            });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,
                description: data.description || '',
                price: Number(data.price),
                quantity: Number(data.quantity),
                slug: newSlug,
                isActive,
                statusId: status.id,
                categoryId: data.categoryId || '',
                brandId: data.brandId || null,
                colorId: data.colorId || null,
                storageId: data.storageId || null,
                connectivityId: data.connectivityId || null,
                simSlotId: data.simSlotId || null,
                batteryHealthId: data.batteryHealthId || null,
                ramId: data.ramId || null,
                cpuId: data.cpuId || null,
                screenSizeId: data.screenSizeId || null,
                typeId: data.typeId || null,
            },
        });

        await prisma.image.deleteMany({
            where: { productId: updatedProduct.id },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    productId: updatedProduct.id,
                    createdDate: new Date(),
                })),
            });
        }

        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Product name already exists',
            };
        }
        return { success: false, error: true, message: 'Failed to update product' };
    }
};

export const deleteProduct = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Product ID is required');
        }

        await prisma.product.delete({
            where: {
                id: id,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error('Delete product error:', error);
        return { success: false, error: true };
    }
};

export const deleteProducts = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.product.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/product/list');
        return { success: true, error: false };
    } catch (error) {
        console.error('Delete products error:', error);
        return { success: false, error: true };
    }
};

export async function exportProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                images: {
                    select: { url: true },
                },
                category: {
                    select: { name: true },
                },
                brand: {
                    select: { name: true },
                },
                color: {
                    select: { name: true, hex: true },
                },
                storage: {
                    select: { name: true },
                },
                connectivity: {
                    select: { name: true },
                },
                simSlot: {
                    select: { title: true },
                },
                batteryHealth: {
                    select: { title: true },
                },
                ram: {
                    select: { title: true },
                },
                cpu: {
                    select: { name: true },
                },
                screenSize: {
                    select: { name: true },
                },
                type: {
                    select: { name: true },
                },
                status: {
                    select: { name: true },
                },
            },
        });

        // Format data for Excel
        const formattedData = products.map((product) => ({
            Name: product.name,
            Description: product.description || '',
            Price: product.price,
            Quantity: product.quantity,
            Category: product.category?.name || '',
            Brand: product.brand?.name || '',
            Color: product.color ? `${product.color.name} - ${product.color.hex}` : '',
            Storage: product.storage?.name || '',
            Connectivity: product.connectivity?.name || '',
            SimSlot: product.simSlot?.title || '',
            BatteryHealth: product.batteryHealth?.title || '',
            RAM: product.ram?.title || '',
            CPU: product.cpu?.name || '',
            ScreenSize: product.screenSize?.name || '',
            Type: product.type?.name || '',
            Status: product.status?.name || '',
            ImageURLs: product.images.map((img) => img.url).join(', ') || '',
            CreatedAt: product.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export products error:', error);
        return { success: false, error: 'Failed to export products' };
    }
}
