import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsColorForm = (locale: 'en' | 'vi') => {
    return messages[locale].ColorForm;
};

export const colorSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsColorForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.colorNameRequired }),
        hex: z.string().regex(/^#[0-9A-F]{6}$/i, { message: t.invalidHex }),
    });
};

export type ColorSchema = z.infer<ReturnType<typeof colorSchema>>;
