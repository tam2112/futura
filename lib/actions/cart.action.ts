'use server';

import prisma from '../prisma';

// Get cart items for a specific user
export const getCartItems = async (userId: string) => {
    try {
        const cartItems = await prisma.cart.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: {
                    include: {
                        images: true, // Include product images for CartItem
                    },
                },
            },
        });

        return cartItems;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

// Add item to cart
export const addToCart = async (userId: string, productId: string) => {
    try {
        // Fetch the product to check available quantity
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { quantity: true },
        });

        if (!product) {
            return { success: false, error: 'Product not found' };
        }
        // Check if item already exists in cart
        const existingCartItem = await prisma.cart.findFirst({
            where: {
                userId: userId,
                productId: productId,
            },
        });

        if (existingCartItem) {
            // Check if adding one more exceeds the product's quantity
            if (existingCartItem.quantity + 1 > product.quantity) {
                return { success: false, error: 'Cannot add to cart: exceeds available stock' };
            }

            // If item exists, increase quantity by 1
            await prisma.cart.update({
                where: {
                    id: existingCartItem.id,
                },
                data: {
                    quantity: existingCartItem.quantity + 1,
                },
            });
        } else {
            // Check if product has at least 1 available
            if (product.quantity < 1) {
                return { success: false, error: 'Cannot add to cart: out of stock' };
            }

            // If item doesn't exist, create new cart item
            await prisma.cart.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity: 1,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error: 'Failed to add item to cart' };
    }
};

// Remove item from cart
export const removeFromCart = async (userId: string, productId: string) => {
    try {
        await prisma.cart.deleteMany({
            where: {
                userId: userId,
                productId: productId,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return { success: false, error: 'Failed to remove item from cart' };
    }
};

// Increase item quantity
export const increaseCartItemQuantity = async (userId: string, productId: string) => {
    try {
        // Fetch the product to check available quantity
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { quantity: true },
        });

        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        const cartItem = await prisma.cart.findFirst({
            where: {
                userId: userId,
                productId: productId,
            },
        });

        if (cartItem) {
            // Check if increasing quantity exceeds product's quantity
            if (cartItem.quantity + 1 > product.quantity) {
                return { success: false, error: 'Cannot increase quantity: exceeds available stock' };
            }

            await prisma.cart.update({
                where: {
                    id: cartItem.id,
                },
                data: {
                    quantity: cartItem.quantity + 1,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error increasing quantity:', error);
        return { success: false, error: 'Failed to increase quantity' };
    }
};

// Decrease item quantity
export const decreaseCartItemQuantity = async (userId: string, productId: string) => {
    try {
        const cartItem = await prisma.cart.findFirst({
            where: {
                userId: userId,
                productId: productId,
            },
        });

        if (cartItem) {
            if (cartItem.quantity > 1) {
                // Decrease quantity if more than 1
                await prisma.cart.update({
                    where: {
                        id: cartItem.id,
                    },
                    data: {
                        quantity: cartItem.quantity - 1,
                    },
                });
            } else {
                // Remove item if quantity would become 0
                await prisma.cart.delete({
                    where: {
                        id: cartItem.id,
                    },
                });
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Error decreasing quantity:', error);
        return { success: false, error: 'Failed to decrease quantity' };
    }
};

// Get cart totals (item count and price)
export const getCartTotals = async (userId: string) => {
    try {
        const cartItems = await prisma.cart.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: true,
            },
        });

        const itemAmount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
        const cartTotal = cartItems.reduce((total: number, item: any) => {
            const price = item.product.priceWithDiscount ?? item.product.price;
            return total + item.quantity * price;
        }, 0);

        return {
            itemAmount,
            cartTotal,
        };
    } catch (error) {
        console.error('Error calculating cart totals:', error);
        throw error;
    }
};
