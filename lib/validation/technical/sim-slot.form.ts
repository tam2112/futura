import { z } from 'zod';

export const simSlotSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: 'Title is required' }),
});

export type SimSlotSchema = z.infer<typeof simSlotSchema>;
