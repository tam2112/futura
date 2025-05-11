'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CiSearch } from 'react-icons/ci';

export default function TableSearch() {
    const t = useTranslations('TableSearch');

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = (e.currentTarget[0] as HTMLInputElement).value;

        const params = new URLSearchParams(window.location.search);
        params.set('search', value);
        router.push(`${window.location.pathname}?${params}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full md:w-auto flex items-center text-xs rounded-full border-[1px] border-black px-2"
        >
            <CiSearch size={18} />
            <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-[200px] py-2 px-2 bg-transparent outline-none"
            />
        </form>
    );
}
