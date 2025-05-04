import { z } from 'zod';

export const deliveryInfoSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    street: z.string().min(1, { message: 'Street is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    phone: z.string().min(1, { message: 'Phone is required' }),
    userId: z.coerce.string().min(1, { message: 'User is required' }),
    orderId: z.coerce.string().min(1, { message: 'Order is required' }),
});

export type DeliveryInfoSchema = z.infer<typeof deliveryInfoSchema>;
