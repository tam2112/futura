import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsRoleForm = (locale: 'en' | 'vi') => {
    return messages[locale].RoleForm;
};

export const roleSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsRoleForm(locale);
    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.roleNameRequired }),
    });
};

export type RoleSchema = z.infer<ReturnType<typeof roleSchema>>;
