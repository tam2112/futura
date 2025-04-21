import { z } from 'zod';

export const connectivitySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Connectivity name is required' }),
});

export type ConnectivitySchema = z.infer<typeof connectivitySchema>;
