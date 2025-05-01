'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ForbiddenPage() {
    const t = useTranslations('Forbidden');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">{t('title')}</h1>
            <p className="mt-4 text-lg text-gray-700">{t('message')}</p>
            <Link href="/" className="mt-6 text-blue-600 hover:underline">
                {t('backToHome')}
            </Link>
        </div>
    );
}
