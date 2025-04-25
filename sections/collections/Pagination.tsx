'use client';

import { ITEM_PER_PAGE } from '@/lib/settings';
import { usePathname, useRouter } from '@/navigation';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

export default function Pagination({ page, count }: { page: number; count: number }) {
    const router = useRouter();
    const pathname = usePathname();

    const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
    const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-center py-8 space-x-4">
            <button
                onClick={() => changePage(page - 1)}
                disabled={!hasPrev}
                className="py-3 px-4 rounded-md bg-gray-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SlArrowLeft />
            </button>
            <div className="flex items-center gap-2 text-sm">
                {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }, (_, index) => {
                    const pageIndex = index + 1;

                    return (
                        <button
                            key={pageIndex}
                            className={`px-4 py-2 rounded-lg hover:bg-gradient-light transition-all duration-300 ${
                                page === pageIndex ? 'bg-gradient-light' : ''
                            }`}
                            onClick={() => changePage(pageIndex)}
                        >
                            {pageIndex}
                        </button>
                    );
                })}
            </div>
            <button
                onClick={() => changePage(page + 1)}
                disabled={!hasNext}
                className="py-3 px-4 rounded-md bg-gray-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SlArrowRight />
            </button>
        </div>
    );
}
