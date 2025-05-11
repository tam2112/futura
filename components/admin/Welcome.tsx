'use client';

import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';

export default function Welcome() {
    const t = useTranslations('HomeAdmin');

    const fullName = Cookies.get('fullName') ?? 'Robert';

    return (
        <h1 className="text-xl font-semibold font-heading ml-2">
            {t('welcome')}, <span className="capitalize">{fullName}</span>
        </h1>
    );
}
