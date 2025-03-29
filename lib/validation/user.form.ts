import { z } from 'zod';

export const signUpSchema = z.object({
    id: z.string().optional(),
    fullName: z
        .string()
        .nonempty({ message: 'Full name is required' })
        .min(2, { message: 'Full name must be at least 2 characters long!' }),
    email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: z
        .string()
        .nonempty({ message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long!' })
        .max(40, { message: 'Password must be at most 40 characters long!' })
        .refine(
            (value) =>
                /[A-Z]/.test(value) && // Kiểm tra chữ hoa
                /[0-9]/.test(value) && // Kiểm tra số
                /[^a-zA-Z0-9]/.test(value), // Kiểm tra ký tự đặc biệt
            {
                message: 'Password must contain at least one uppercase letter, one number, and one special character!',
            },
        ),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: z
        .string()
        .nonempty({ message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long!' })
        .max(40, { message: 'Password must be at most 40 characters long!' })
        .refine(
            (value) =>
                /[A-Z]/.test(value) && // Kiểm tra chữ hoa
                /[0-9]/.test(value) && // Kiểm tra số
                /[^a-zA-Z0-9]/.test(value), // Kiểm tra ký tự đặc biệt
            {
                message: 'Password must contain at least one uppercase letter, one number, and one special character!',
            },
        ),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const userSchema = z.object({
    id: z.string().optional(),
    fullName: z
        .string()
        .nonempty({ message: 'Full name is required' })
        .min(2, { message: 'Full name must be at least 2 characters long!' }),
    email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: z
        .string()
        .nonempty({ message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long!' })
        .max(40, { message: 'Password must be at most 40 characters long!' })
        .refine(
            (value) =>
                /[A-Z]/.test(value) && // Kiểm tra chữ hoa
                /[0-9]/.test(value) && // Kiểm tra số
                /[^a-zA-Z0-9]/.test(value), // Kiểm tra ký tự đặc biệt
            {
                message: 'Password must contain at least one uppercase letter, one number, and one special character!',
            },
        ),
    roleId: z.coerce.string().min(1, { message: 'Role is required' }),
});

export type UserSchema = z.infer<typeof userSchema>;
