import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsBrandForm = (locale: 'en' | 'vi') => {
    return messages[locale].BrandForm;
};

export const brandSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsBrandForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.brandNameRequired }),
        imageUrls: z.array(z.string()).optional(),
    });
};

export type BrandSchema = z.infer<ReturnType<typeof brandSchema>>;
