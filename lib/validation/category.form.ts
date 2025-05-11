import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsCategoryForm = (locale: 'en' | 'vi') => {
    return messages[locale].CategoryForm;
};

export const categorySchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsCategoryForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.categoryIsRequired }),
        description: z.string().optional(),
        slug: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
    });
};

export type CategorySchema = z.infer<ReturnType<typeof categorySchema>>;
