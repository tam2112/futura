import { z } from 'zod';

export const roleSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Role name is required' }),
});

export type RoleSchema = z.infer<typeof roleSchema>;
