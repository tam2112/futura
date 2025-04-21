import { z } from 'zod';

export const batteryHealthSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: 'Title is required' }),
});

export type BatteryHealthSchema = z.infer<typeof batteryHealthSchema>;
