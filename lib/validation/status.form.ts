import { z } from 'zod';

export const statusSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Role name is required' }),
});

export type StatusSchema = z.infer<typeof statusSchema>;
