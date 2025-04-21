import { z } from 'zod';

export const brandSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Brand name is required' }),
    imageUrls: z.array(z.string()).optional(),
});

export type BrandSchema = z.infer<typeof brandSchema>;
