import { z } from 'zod';

export const ramSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: 'Title is required' }),
});

export type RamSchema = z.infer<typeof ramSchema>;
