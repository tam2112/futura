/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '../prisma';
import { revalidatePath } from 'next/cache';
import { DeliveryInfoSchema } from '../validation/deliveryInfo.form';

type OrderResponse = {
    success: boolean;
    error: boolean;
    message?: string;
    data?: any;
};

export type OrderStatus = 'Pending' | 'Out for delivery' | 'Delivered' | 'Cancelled';

export const getAllOrders = async () => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdDate: 'desc',
            },
        });
        return orders;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const getUserOrders = async (userId: string) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
            },
            orderBy: {
                createdDate: 'desc',
            },
        });
        return orders;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

export const createOrder = async (userId: string, deliveryInfo: DeliveryInfoSchema): Promise<OrderResponse> => {
    try {
        // Start transaction
        await prisma.$transaction(async (prisma) => {
            // 1. Get pending status
            const pendingStatus = await prisma.status.findUnique({
                where: { name: 'Pending' },
            });

            if (!pendingStatus) {
                throw new Error('Pending status not found');
            }

            // 2. Get cart items
            const cartItems = await prisma.cart.findMany({
                where: { userId },
                include: { product: true },
            });

            if (cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            // 3. Validate product quantities
            for (const cartItem of cartItems) {
                if (cartItem.quantity > cartItem.product.quantity) {
                    throw new Error(`Insufficient stock for product ID ${cartItem.productId}`);
                }
            }

            // 4. Create orders for each cart item
            const orderPromises = cartItems.map(async (cartItem) => {
                // Create order
                const order = await prisma.order.create({
                    data: {
                        userId,
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        statusId: pendingStatus.id,
                    },
                });

                // Update product quantity
                await prisma.product.update({
                    where: { id: cartItem.productId },
                    data: {
                        quantity: {
                            decrement: cartItem.quantity,
                        },
                    },
                });

                // Create delivery info
                await prisma.delivery.create({
                    data: {
                        firstName: deliveryInfo.firstName,
                        lastName: deliveryInfo.lastName,
                        street: deliveryInfo.street,
                        city: deliveryInfo.city,
                        country: deliveryInfo.country,
                        phone: deliveryInfo.phone,
                        userId,
                        orderId: order.id,
                    },
                });

                return order;
            });

            // Wait for all orders and delivery info to be created
            const orders = await Promise.all(orderPromises);

            // 5. Clear cart
            await prisma.cart.deleteMany({
                where: { userId },
            });

            return orders;
        });

        // If we get here, the transaction was successful
        revalidatePath('/cart');
        revalidatePath('/my-orders');

        return {
            success: true,
            error: false,
            message: 'Orders created successfully',
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            success: false,
            error: true,
            message: error instanceof Error ? error.message : 'Failed to create order',
        };
    }
};

export const updateOrderStatus = async ({
    orderId,
    statusId,
}: {
    orderId: string;
    statusId: string;
}): Promise<OrderResponse> => {
    try {
        // Check if the order exists and get its current status
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { status: true },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Prevent update if the order is cancelled
        if (order.status.name === 'Cancelled') {
            throw new Error('Cannot update a cancelled order');
        }

        // Verify the new status exists and is one of the allowed statuses
        const allowedStatuses = ['Pending', 'Out for delivery', 'Delivered'];
        const status = await prisma.status.findUnique({
            where: { id: statusId },
        });

        if (!status) {
            throw new Error('Status not found');
        }

        if (!allowedStatuses.includes(status.name)) {
            throw new Error(`Invalid status. Allowed statuses are: ${allowedStatuses.join(', ')}`);
        }

        // Update the order with the new status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { statusId: status.id },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });

        revalidatePath('/list/orders');

        return {
            success: true,
            error: false,
            data: updatedOrder,
            message: `Order status updated to ${status.name}`,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: true,
            data: null,
            message: error instanceof Error ? error.message : 'Failed to update order status',
        };
    }
};

export const updateOrderStatusByName = async (orderId: string, statusName: OrderStatus) => {
    try {
        // Get the status ID for the new status
        const status = await prisma.status.findUnique({
            where: { name: statusName },
        });

        if (!status) {
            throw new Error(`Status '${statusName}' not found`);
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { status: true, product: true },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // If the new status is 'Cancelled' and the order is not already cancelled, restore product quantity
        if (statusName === 'Cancelled' && order.status.name !== 'Cancelled') {
            await prisma.product.update({
                where: { id: order.productId },
                data: {
                    quantity: {
                        increment: order.quantity,
                    },
                },
            });
        }

        // Update the order with the new status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { statusId: status.id },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });

        revalidatePath('/list/orders');

        return {
            success: true,
            error: false,
            data: updatedOrder,
            message: `Order status updated to ${statusName}`,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: true,
            data: null,
            message: error instanceof Error ? error.message : 'Failed to update order status',
        };
    }
};

export async function exportOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                product: {
                    select: { name: true, price: true, priceWithDiscount: true },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });

        // Format data for Excel
        const formattedData = orders.map((order) => ({
            'Product name': order.product.name || '',
            Status: order.status.name || '',
            'User name': order.user.fullName || '',
            'User email': order.user.email || '',
            'Delivery first name': order.deliveryInfo[0].firstName || '',
            'Delivery last name': order.deliveryInfo[0].lastName || '',
            'Delivery street': order.deliveryInfo[0].street || '',
            'Delivery city': order.deliveryInfo[0].city || '',
            'Delivery country': order.deliveryInfo[0].country || '',
            'Delivery phone': order.deliveryInfo[0].phone || '',
            Quantity: order.quantity || 0,
            'Total price': order.product.priceWithDiscount
                ? (order.product.priceWithDiscount * order.quantity).toFixed(2)
                : (order.product.price * order.quantity).toFixed(2),
            'Created At': order.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export orders error:', error);
        return { success: false, error: 'Failed to export orders' };
    }
}
