import { z } from 'zod';

export const categorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Category name is required' }),
    description: z.string().optional(),
    slug: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
});

export type CategorySchema = z.infer<typeof categorySchema>;
