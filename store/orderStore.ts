import { getUserOrders } from '@/lib/actions/order.action';
import { create } from 'zustand';

type Order = {
    id: string;
    createdDate: Date;
    quantity: number;
    status: {
        name: string;
    };
    product: {
        name: string;
        price: number;
        images: { url: string }[];
    };
    deliveryInfo: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        country: string;
        phone: string;
    }[];
};

type OrderStore = {
    orders: Order[];
    fetchOrders: (userId: string) => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    fetchOrders: async (userId: string) => {
        try {
            const data = await getUserOrders(userId);
            // Ensure images is always an array
            const sanitizedOrders = data.map((order) => ({
                ...order,
                product: {
                    ...order.product,
                    images: Array.isArray(order.product.images) ? order.product.images : [],
                },
            }));
            set({ orders: sanitizedOrders });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    },
}));
