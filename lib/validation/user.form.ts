import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsSignIn = (locale: 'en' | 'vi') => {
    return messages[locale].SignInPage;
};
const getTranslationsSignUp = (locale: 'en' | 'vi') => {
    return messages[locale].SignUpPage;
};
const getTranslationsUserForm = (locale: 'en' | 'vi') => {
    return messages[locale].UserForm;
};
const getTranslationsRecover = (locale: 'en' | 'vi') => {
    return messages[locale].RecoverPage;
};

export const signUpSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsSignUp(locale);

    return z.object({
        id: z.string().optional(),
        fullName: z.string().nonempty({ message: t.fullNameRequired }).min(2, { message: t.minFullName }),
        email: z.string().nonempty({ message: t.emailIsRequired }).email({ message: t.invalidEmail }),
        password: z
            .string()
            .nonempty({ message: t.passwordIsRequired })
            .min(8, { message: t.minPassword })
            .max(40, { message: t.maxPassword })
            .refine(
                (value) =>
                    /[A-Z]/.test(value) && // Kiểm tra chữ hoa
                    /[0-9]/.test(value) && // Kiểm tra số
                    /[^a-zA-Z0-9]/.test(value), // Kiểm tra ký tự đặc biệt
                {
                    message: t.passwordContainRequired,
                },
            ),
    });
};

export type SignUpSchema = z.infer<ReturnType<typeof signUpSchema>>;

export const loginSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsSignIn(locale);

    return z.object({
        email: z.string().nonempty({ message: t.emailIsRequired }).email({ message: t.invalidEmail }),
        password: z
            .string()
            .nonempty({ message: t.passwordIsRequired })
            .min(8, { message: t.minPassword })
            .max(40, { message: t.maxPassword })
            .refine(
                (value) =>
                    /[A-Z]/.test(value) && // Kiểm tra chữ hoa
                    /[0-9]/.test(value) && // Kiểm tra số
                    /[^a-zA-Z0-9]/.test(value), // Kiểm tra ký tự đặc biệt
                {
                    message: t.passwordContainRequired,
                },
            ),
    });
};

export type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;

export const userSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsUserForm(locale);

    return z.object({
        id: z.string().optional(),
        fullName: z.string().nonempty({ message: t.fullNameRequired }).min(2, { message: t.minFullName }),
        email: z.string().nonempty({ message: t.emailIsRequired }).email({ message: t.invalidEmail }),
        password: z
            .string()
            .nonempty({ message: t.passwordIsRequired })
            .min(8, { message: t.minPassword })
            .max(40, { message: t.maxPassword })
            .refine(
                (value) =>
                    /[A-Z]/.test(value) && // Kiểm tra chữ hoa
                    /[0-9]/.test(value) && // Kiểm tra số
                    /[^a-zA-Z0-9]/.test(value), // Kiểm tra ký tự đặc biệt
                {
                    message: t.passwordContainRequired,
                },
            ),
        roleId: z.coerce.string().min(1, { message: t.roleRequired }),
    });
};

export type UserSchema = z.infer<ReturnType<typeof userSchema>>;

export const changePasswordSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsUserForm(locale);

    return z
        .object({
            oldPassword: z.string().nonempty({ message: t.oldPasswordIsRequired }),
            newPassword: z
                .string()
                .nonempty({ message: t.newPasswordIsRequired })
                .min(8, { message: t.minPassword })
                .max(40, { message: t.maxPassword })
                .refine(
                    (value) =>
                        /[A-Z]/.test(value) && // Kiểm tra chữ hoa
                        /[0-9]/.test(value) && // Kiểm tra số
                        /[^a-zA-Z0-9]/.test(value), // Kiểm tra ký tự đặc biệt
                    {
                        message: t.passwordContainRequired,
                    },
                ),
            confirmNewPassword: z.string().nonempty({ message: t.confirmNewPasswordIsRequired }),
        })
        .refine((data) => data.newPassword === data.confirmNewPassword, {
            message: t.passwordsNotMatch,
            path: ['confirmNewPassword'],
        });
};

export type ChangePasswordSchema = z.infer<ReturnType<typeof changePasswordSchema>>;

export const recoverSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsRecover(locale);

    return z
        .object({
            email: z.string().nonempty({ message: t.emailIsRequired }).email({ message: t.invalidEmail }),
            verificationCode: z
                .string()
                .optional()
                .refine((value) => !value || /^\d{6}$/.test(value), { message: t.invalidCode }),
            newPassword: z
                .string()
                .optional()
                .refine(
                    (value) =>
                        !value ||
                        (value.length >= 8 &&
                            value.length <= 40 &&
                            /[A-Z]/.test(value) &&
                            /[0-9]/.test(value) &&
                            /[^a-zA-Z0-9]/.test(value)),
                    {
                        message: t.passwordContainRequired,
                    },
                ),
            confirmNewPassword: z.string().optional(),
        })
        .refine((data) => !data.newPassword || data.newPassword === data.confirmNewPassword, {
            message: t.passwordsNotMatch,
            path: ['confirmNewPassword'],
        });
};

export type RecoverSchema = z.infer<ReturnType<typeof recoverSchema>>;

export const verifyCodeSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsRecover(locale);

    return z.object({
        verificationCode: z
            .string()
            .nonempty({ message: t.codeIsRequired })
            .refine((value) => /^\d{6}$/.test(value), { message: t.invalidCode }),
    });
};

export type VerifyCodeSchema = z.infer<ReturnType<typeof verifyCodeSchema>>;
