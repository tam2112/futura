import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsTypeForm = (locale: 'en' | 'vi') => {
    return messages[locale].TypeForm;
};

export const typeSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsTypeForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.typeNameRequired }),
    });
};

export type TypeSchema = z.infer<ReturnType<typeof typeSchema>>;
