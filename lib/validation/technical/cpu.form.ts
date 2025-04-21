import { z } from 'zod';

export const cpuSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'CPU name is required' }),
});

export type CpuSchema = z.infer<typeof cpuSchema>;
