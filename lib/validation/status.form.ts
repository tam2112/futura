import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsStatusForm = (locale: 'en' | 'vi') => {
    return messages[locale].StatusForm;
};

export const statusSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsStatusForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.statusNameRequired }),
    });
};

export type StatusSchema = z.infer<ReturnType<typeof statusSchema>>;
