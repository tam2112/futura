'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CiUndo } from 'react-icons/ci';
import Loader from '@/components/Loader';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';

export default function ReloadButton() {
    const t = useTranslations('Common');

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleReload = () => {
        if (isLoading) return; // Prevent multiple clicks

        setIsLoading(true);

        // Show loader after 0.5s
        setTimeout(() => {
            // Reload after another 0.5s
            setTimeout(() => {
                router.refresh();
                setIsLoading(false); // Reset loading state after reload
            }, 500);
        }, 500);
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
                    <Loader />
                </div>
            )}
            <button
                onClick={handleReload}
                className="size-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-gradient-lighter transition-all duration-300 disabled:opacity-50"
                disabled={isLoading}
                data-tooltip-id="reload-tooltip"
                data-tooltip-content={t('reload')}
            >
                <CiUndo width={14} height={14} />
            </button>
            <Tooltip id="reload-tooltip" />
        </>
    );
}
