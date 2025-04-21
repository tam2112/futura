import { z } from 'zod';

export const typeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Type name is required' }),
});

export type TypeSchema = z.infer<typeof typeSchema>;
