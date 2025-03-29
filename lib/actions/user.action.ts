// user.action.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import bcrypt from 'bcrypt';

import { loginSchema, LoginSchema, UserSchema, signUpSchema, SignUpSchema } from '../validation/user.form';
import prisma from '../prisma';
import { generateToken } from '../auth';

type CurrentState = { success: boolean; error: boolean };

export const signUpUser = async (
    currentState: CurrentState,
    data: SignUpSchema,
): Promise<{
    success: boolean;
    error: boolean;
    message?: string;
    token?: string;
    userId?: string;
    user?: any;
}> => {
    try {
        // Xác thực dữ liệu đầu vào
        signUpSchema.parse(data);

        // check username exists
        const existingName = await prisma.user.findUnique({
            where: { fullName: data.fullName },
        });
        if (existingName) {
            return {
                success: false,
                error: true,
                message: 'Full name is already exists',
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
                message: 'Email is already exists',
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

export const signInUser = async (currentState: CurrentState, data: LoginSchema) => {
    try {
        loginSchema.parse(data);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { role: true }, // Include role information
        });

        if (!user) {
            return {
                success: false,
                error: true,
                message: 'Email not exist!',
            };
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: 'Password not match!',
            };
        }

        // Generate token with role information
        const token = generateToken(user.id, user.role.name);
        const userId = user.id;

        return {
            success: true,
            error: false,
            userId,
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
        return { success: false, error: true };
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

export const createUser = async (currentState: CurrentState, data: UserSchema) => {
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
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const updateUser = async (currentState: CurrentState, data: UserSchema) => {
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
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
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
