import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/[^\w\-]+/g, '') // Loại bỏ ký tự đặc biệt
        .replace(/\-\-+/g, '-') // Giảm nhiều gạch ngang liên tiếp thành 1
        .replace(/^-+/, '') // Loại bỏ gạch ngang ở đầu
        .replace(/-+$/, ''); // Loại bỏ gạch ngang ở cuối
};

export function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
