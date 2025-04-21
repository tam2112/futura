import { z } from 'zod';

export const screenSizeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Screen size name is required' }),
});

export type ScreenSizeSchema = z.infer<typeof screenSizeSchema>;
