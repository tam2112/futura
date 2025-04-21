import { z } from 'zod';

export const colorSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Color name is required' }),
    hex: z.string().regex(/^#[0-9A-F]{6}$/i, { message: 'Invalid hex color code' }),
});

export type ColorSchema = z.infer<typeof colorSchema>;
