import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsConnectivityForm = (locale: 'en' | 'vi') => {
    return messages[locale].ConnectivityForm;
};

export const connectivitySchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsConnectivityForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.connectivityNameRequired }),
    });
};

export type ConnectivitySchema = z.infer<ReturnType<typeof connectivitySchema>>;
