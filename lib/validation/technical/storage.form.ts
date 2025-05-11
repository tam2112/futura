import { messages } from '@/lib/messages';
import { z } from 'zod';

const getTranslationsStorageForm = (locale: 'en' | 'vi') => {
    return messages[locale].StorageForm;
};

export const storageSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsStorageForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.storageNameRequired }),
    });
};

export type StorageSchema = z.infer<ReturnType<typeof storageSchema>>;
