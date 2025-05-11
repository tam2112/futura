import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsCheckoutModal = (locale: 'en' | 'vi') => {
    return messages[locale].CheckoutModal;
};

export const deliveryInfoSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsCheckoutModal(locale);

    return z.object({
        id: z.string().optional(),
        firstName: z.string().min(1, { message: t.firstNameRequired }),
        lastName: z.string().min(1, { message: t.lastNameRequired }),
        street: z.string().min(1, { message: t.streetRequired }),
        city: z.string().min(1, { message: t.cityRequired }),
        country: z.string().min(1, { message: t.countryRequired }),
        phone: z.string().min(1, { message: t.phoneRequired }),
        userId: z.coerce.string().min(1, { message: 'User is required' }),
        orderId: z.coerce.string().min(1, { message: 'Order is required' }),
    });
};

export type DeliveryInfoSchema = z.infer<ReturnType<typeof deliveryInfoSchema>>;
