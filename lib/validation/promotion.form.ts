import { z } from 'zod';

export const promotionSchema = z
    .object({
        id: z.string().optional(),
        name: z.string().min(1, 'Promotion name is required'),
        percentageNumber: z.coerce
            .number()
            .min(1, 'Percentage number must be at least 1%')
            .max(99, 'Percentage number must be less than 100%'),
        durationType: z.enum(['date', 'hours', 'minutes', 'seconds'], {
            errorMap: () => ({ message: 'Duration type is required' }),
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
        { message: 'Invalid or missing date range', path: ['endDate'] },
    )
    .refine(
        (data) => {
            if (data.durationType === 'hours') {
                return data.startHours !== undefined && data.endHours !== undefined && data.endHours > data.startHours;
            }
            return true;
        },
        { message: 'Invalid or missing hours range', path: ['endHours'] },
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
        { message: 'Invalid or missing minutes range', path: ['endMinutes'] },
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
        { message: 'Invalid or missing seconds range', path: ['endSeconds'] },
    );

export type PromotionSchema = z.infer<typeof promotionSchema>;
