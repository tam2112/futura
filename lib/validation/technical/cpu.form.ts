import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsCpuForm = (locale: 'en' | 'vi') => {
    return messages[locale].CpuForm;
};

export const cpuSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsCpuForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.cpuNameRequired }),
    });
};

export type CpuSchema = z.infer<ReturnType<typeof cpuSchema>>;
