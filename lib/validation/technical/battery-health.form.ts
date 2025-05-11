import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsBatteryHealthForm = (locale: 'en' | 'vi') => {
    return messages[locale].BatteryHealthForm;
};

export const batteryHealthSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsBatteryHealthForm(locale);

    return z.object({
        id: z.string().optional(),
        title: z.string().min(1, { message: t.titleRequired }),
    });
};

export type BatteryHealthSchema = z.infer<ReturnType<typeof batteryHealthSchema>>;
