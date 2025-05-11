import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsScreenSizeForm = (locale: 'en' | 'vi') => {
    return messages[locale].ScreenSizeForm;
};

export const screenSizeSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsScreenSizeForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.screenSizeNameRequired }),
    });
};

export type ScreenSizeSchema = z.infer<ReturnType<typeof screenSizeSchema>>;
