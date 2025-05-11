import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsRamForm = (locale: 'en' | 'vi') => {
    return messages[locale].RamForm;
};

export const ramSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsRamForm(locale);

    return z.object({
        id: z.string().optional(),
        title: z.string().min(1, { message: t.titleRequired }),
    });
};

export type RamSchema = z.infer<ReturnType<typeof ramSchema>>;
