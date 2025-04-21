'use client';

import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { GoChevronDown } from 'react-icons/go';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import Loader from '../Loader';

type SortOption = {
    value: string;
    label: string;
};

const sortOptions: SortOption[] = [
    { value: 'name-asc', label: 'A-Z' },
    { value: 'name-desc', label: 'Z-A' },
    { value: 'date-desc', label: 'Latest Release' },
    { value: 'date-asc', label: 'Oldest Release' },
];

type FilterDropdownProps = {
    currentSort: string;
};

export default function FilterDropdown({ currentSort }: FilterDropdownProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const handleSortChange = async (newSort: string) => {
        if (isLoading) return; // Prevent multiple clicks
        setIsLoading(true);

        // Simulate delay for 1.5 seconds
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            const params = new URLSearchParams(searchParams.toString());
            params.set('sort', newSort);
            params.set('page', '1'); // Reset to page 1 on sort change
            router.push(`/admin/category/list?${params.toString()}`);
            toast('Categories sorted successfully!');
        } catch (error) {
            console.error('Sort error:', error);
            toast.error('Failed to sort categories.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
                    <Loader />
                </div>
            )}
            <div
                data-tooltip-id="filter-tooltip"
                data-tooltip-content="Filter"
                className="relative bg-white border border-black rounded-full"
            >
                <select
                    className="appearance-none py-1 px-3 min-w-[160px] rounded-full outline-none cursor-pointer focus:outline-none"
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <GoChevronDown />
                </span>
            </div>
            <Tooltip id="filter-tooltip" />
        </>
    );
}
