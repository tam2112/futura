import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsProductForm = (locale: 'en' | 'vi') => {
    return messages[locale].ProductForm;
};

export const productSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsProductForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.productNameRequired }),
        description: z.string().min(1, { message: t.descriptionRequired }),
        price: z.coerce.number().min(1, { message: t.priceRequired }),
        quantity: z.coerce.number().min(0, { message: t.quantityRequired }),
        priceWithDiscount: z.number().optional(),
        slug: z.string().optional(),
        categoryId: z.coerce.string().min(1, { message: t.categoryRequired }),
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
};

export type ProductSchema = z.infer<ReturnType<typeof productSchema>>;
