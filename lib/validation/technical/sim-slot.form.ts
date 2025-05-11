import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsSimSlotForm = (locale: 'en' | 'vi') => {
    return messages[locale].SimSlotForm;
};

export const simSlotSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsSimSlotForm(locale);

    return z.object({
        id: z.string().optional(),
        title: z.string().min(1, { message: t.titleRequired }),
    });
};

export type SimSlotSchema = z.infer<ReturnType<typeof simSlotSchema>>;
