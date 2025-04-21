import { z } from 'zod';

export const storageSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Storage name is required' }),
});

export type StorageSchema = z.infer<typeof storageSchema>;
