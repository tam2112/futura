import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsPromotionForm = (locale: 'en' | 'vi') => {
    return messages[locale].PromotionForm;
};

export const promotionSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsPromotionForm(locale);

    return z
        .object({
            id: z.string().optional(),
            name: z.string().min(1, t.promotionNameRequired),
            percentageNumber: z.coerce.number().min(1, t.minPercentageNumber).max(99, t.maxPercentageNumber),
            durationType: z.enum(['date', 'hours', 'minutes', 'seconds'], {
                errorMap: () => ({ message: t.durationTypeRequired }),
            }),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            startHours: z.coerce.number().optional(),
            endHours: z.coerce.number().optional(),
            startMinutes: z.coerce.number().optional(),
            endMinutes: z.coerce.number().optional(),
            startSeconds: z.coerce.number().optional(),
            endSeconds: z.coerce.number().optional(),
            remainingTime: z.coerce.number().optional(),
            productIds: z.array(z.string()).optional(),
            categoryIds: z.array(z.string()).optional(),
        })
        .refine(
            (data) => {
                if (data.durationType === 'date') {
                    return (
                        data.startDate &&
                        data.endDate &&
                        !isNaN(Date.parse(data.startDate)) &&
                        !isNaN(Date.parse(data.endDate)) &&
                        new Date(data.endDate) > new Date(data.startDate)
                    );
                }
                return true;
            },
            { message: t.invalidOrMissingDate, path: ['endDate'] },
        )
        .refine(
            (data) => {
                if (data.durationType === 'hours') {
                    return (
                        data.startHours !== undefined && data.endHours !== undefined && data.endHours > data.startHours
                    );
                }
                return true;
            },
            { message: t.invalidOrMissingHours, path: ['endHours'] },
        )
        .refine(
            (data) => {
                if (data.durationType === 'minutes') {
                    return (
                        data.startMinutes !== undefined &&
                        data.endMinutes !== undefined &&
                        data.endMinutes > data.startMinutes
                    );
                }
                return true;
            },
            { message: t.invalidOrMissingMinutes, path: ['endMinutes'] },
        )
        .refine(
            (data) => {
                if (data.durationType === 'seconds') {
                    return (
                        data.startSeconds !== undefined &&
                        data.endSeconds !== undefined &&
                        data.endSeconds > data.startSeconds
                    );
                }
                return true;
            },
            { message: t.invalidOrMissingSeconds, path: ['endSeconds'] },
        );
};

export type PromotionSchema = z.infer<ReturnType<typeof promotionSchema>>;
