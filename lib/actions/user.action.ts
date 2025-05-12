// user.action.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import bcrypt from 'bcrypt';

import {
    loginSchema,
    LoginSchema,
    UserSchema,
    signUpSchema,
    SignUpSchema,
    ChangePasswordSchema,
    changePasswordSchema,
} from '../validation/user.form';
import prisma from '../prisma';
import { generateToken } from '../auth';
import { revalidatePath } from 'next/cache';
import { messages } from '../messages';
import { z } from 'zod';

type CurrentState = { success: boolean; error: boolean };

export const signUpUser = async (
    currentState: CurrentState,
    data: SignUpSchema,
    locale: 'en' | 'vi' = 'en',
): Promise<{
    success: boolean;
    error: boolean;
    message?: string;
    token?: string;
    userId?: string;
    user?: any;
}> => {
    try {
        const t = messages[locale].SignUpPage;
        signUpSchema(locale).parse(data);

        // check username exists
        const existingName = await prisma.user.findUnique({
            where: { fullName: data.fullName },
        });
        if (existingName) {
            return {
                success: false,
                error: true,
                message: t.fullNameExists,
            };
        }

        // check email exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            return {
                success: false,
                error: true,
                message: t.emailExists,
            };
        }

        // Lấy role Guest từ database
        const guestRole = await prisma.role.findUnique({
            where: { name: 'guest' },
        });

        if (!guestRole) {
            console.error('Guest role not found in database');
            return {
                success: false,
                error: true,
                message: 'Guest role not found',
            };
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Tạo người dùng mới với role Guest
        const newUser = await prisma.user.create({
            data: {
                fullName: data.fullName,
                password: hashedPassword,
                email: data.email,
                roleId: guestRole.id, // Sử dụng ID của role Guest
            },
            include: {
                role: true, // Include role information in the response
            },
        });

        // Tạo token cho người dùng
        const token = generateToken(newUser.id, newUser.role.name);

        const result = {
            success: true,
            error: false,
            token,
            userId: newUser.id,
            user: newUser,
        };
        console.log('signUpUser result:', result);

        return result;
    } catch (error) {
        console.error('Error in signUpUser:', error);

        return { success: false, error: true };
    }
};

export const signInUser = async (currentState: CurrentState, data: LoginSchema, locale: 'en' | 'vi' = 'en') => {
    try {
        const t = messages[locale].SignInPage;
        loginSchema(locale).parse(data);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { role: true }, // Include role information
        });

        if (!user) {
            return {
                success: false,
                error: true,
                message: t.emailNotExist,
            };
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: t.passwordNotMatch,
            };
        }

        // Generate token with role information
        const token = generateToken(user.id, user.role.name);
        const userId = user.id;
        const fullName = user.fullName;
        const email = user.email;

        return {
            success: true,
            error: false,
            userId,
            fullName,
            email,
            token,
            user,
            role: user.role.name, // Include role in response
            users: {
                ...user,
                role: user.role.name,
            },
        };
    } catch (error) {
        console.error('Error in signInUser:', error);
        return { success: false, error: true, message: messages[locale].SignInPage.signInFailed };
    }
};

export const getUsers = async () => {
    try {
        const users = await prisma.user.findMany({});
        return users;
    } catch (error) {
        console.error(error);
    }
};

export const createUser = async (currentState: CurrentState, data: UserSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].UserForm;
    try {
        await prisma.user.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                password: await bcrypt.hash(data.password, 10),
                roleId: data.roleId,
            },
        });

        // revalidatePath('/list/categories');
        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: t.nameOrEmailExists,
            };
        }
        return { success: false, error: true, message: t.createFailed };
    }
};

export const updateUser = async (currentState: CurrentState, data: UserSchema & { locale?: 'en' | 'vi' }) => {
    const locale = data.locale || 'en';
    const t = messages[locale].UserForm;
    try {
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                fullName: data.fullName,
                email: data.email,
                password: await bcrypt.hash(data.password, 10),
                roleId: data.roleId,
            },
        });

        // revalidatePath('/list/categories');
        return { success: true, error: false };
    } catch (error: any) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: t.nameOrEmailExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const updateUserFullName = async (
    currentState: CurrentState,
    data: { id: string; fullName: string; locale?: 'en' | 'vi' },
) => {
    const locale = data.locale || 'en';
    const t = messages[locale].UserForm;
    try {
        // Validate fullName
        const schema = z.object({
            fullName: z.string().nonempty({ message: t.fullNameRequired }).min(2, { message: t.minFullName }),
        });
        schema.parse({ fullName: data.fullName });

        // Check if fullName already exists
        const existingName = await prisma.user.findUnique({
            where: { fullName: data.fullName },
        });
        if (existingName && existingName.id !== data.id) {
            return {
                success: false,
                error: true,
                message: t.fullNameExists,
            };
        }

        await prisma.user.update({
            where: { id: data.id },
            data: { fullName: data.fullName },
        });

        revalidatePath('/my-profile');
        return { success: true, error: false, message: t.updateFullNameSuccess };
    } catch (error: any) {
        console.error('Error in updateUserFullName:', error);
        if (error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: t.fullNameExists,
            };
        }
        return { success: false, error: true, message: t.updateFailed };
    }
};

export const changeUserPassword = async (
    currentState: CurrentState,
    data: ChangePasswordSchema & { userId: string; locale?: 'en' | 'vi' },
) => {
    const locale = data.locale || 'en';
    const t = messages[locale].UserForm;
    try {
        changePasswordSchema(locale).parse(data);

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!user) {
            return {
                success: false,
                error: true,
                message: t.userNotFound,
            };
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: t.oldPasswordNotMatch,
            };
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: data.userId },
            data: { password: hashedNewPassword },
        });

        return { success: true, error: false, message: t.passwordChangeSuccess };
    } catch (error: any) {
        console.error('Error in changeUserPassword:', error);
        return { success: false, error: true, message: t.passwordChangeFailed };
    }
};

export const deleteUser = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        await prisma.user.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath('/list/categories');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const deleteUsers = async (currentState: CurrentState, ids: string[]) => {
    try {
        await prisma.color.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        revalidatePath('/admin/user/list');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export async function exportUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true,
            },
        });

        // Format data for Excel
        const formattedData = users.map((user) => ({
            'Full name': user.fullName,
            Email: user.email,
            Role: user.role.name,
            'Create at': user.createdDate.toISOString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Export users error:', error);
        return { success: false, error: 'Failed to export users' };
    }
}
