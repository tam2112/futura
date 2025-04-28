import { z } from 'zod';

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Product name is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    price: z.coerce.number().min(1, { message: 'Price is required' }),
    quantity: z.coerce.number().min(0, { message: 'Quantity is required' }),
    priceWithDiscount: z.number().optional(),
    slug: z.string().optional(),
    categoryId: z.coerce.string().min(1, { message: 'Category is required' }),
    brandId: z.coerce.string().optional(),
    colorId: z.coerce.string().optional(),
    storageId: z.coerce.string().optional(),
    connectivityId: z.coerce.string().optional(),
    simSlotId: z.coerce.string().optional(),
    batteryHealthId: z.coerce.string().optional(),
    ramId: z.coerce.string().optional(),
    cpuId: z.coerce.string().optional(),
    screenSizeId: z.coerce.string().optional(),
    typeId: z.coerce.string().optional(),
    imageUrls: z.array(z.string()).optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
