'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';

type SortOption = {
    value: string;
    label: string;
};

type FilterDropdownProps = {
    currentSort: string; // Comma-separated string, e.g., "name-asc,date-desc"
    sortOptions: SortOption[];
    entityName?: string;
};

export default function FilterTechnicalDropdown({
    currentSort,
    sortOptions,
    entityName = 'Items',
}: FilterDropdownProps) {
    const t = useTranslations('UserList');

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<SortOption[]>(() => {
        // Initialize from currentSort
        const sortValues = currentSort ? currentSort.split(',') : ['date-desc'];
        return sortValues
            .map((value) => sortOptions.find((option) => option.value === value))
            .filter((option): option is SortOption => !!option);
    });

    const handleSortChange = async (newOptions: SortOption[]) => {
        if (isLoading) return;
        setIsLoading(true);
        setSelectedOptions(newOptions);

        // Simulate delay for 1.5 seconds
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            const params = new URLSearchParams(searchParams.toString());
            const sortValue = newOptions.length > 0 ? newOptions.map((opt) => opt.value).join(',') : 'date-desc';
            params.set('sort', sortValue);
            params.set('page', '1'); // Reset to page 1 on sort change
            const formattedEntityName = entityName.toLowerCase().replace(/\s+/g, '-');
            router.push(`/admin/technical/${formattedEntityName}/list?${params.toString()}`);
            toast(`${entityName} sorted successfully!`);
        } catch (error) {
            console.error('Sort error:', error);
            toast.error(`Failed to sort ${entityName.toLowerCase()}.`);
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
                className="relative w-64"
                data-tooltip-id="sort-tooltip"
                data-tooltip-content={`${t('sort')} ${entityName}`}
            >
                <Select
                    isMulti
                    options={sortOptions}
                    value={selectedOptions}
                    onChange={(newOptions) => handleSortChange(newOptions as SortOption[])}
                    isDisabled={isLoading}
                    placeholder={`${t('sort')} ${entityName}`}
                    className="text-sm"
                    classNamePrefix="react-select"
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: '#fff',
                            borderRadius: '9999px',
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #000',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            minHeight: '38px',
                            height: '38px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease-in-out',
                            // ':hover': {
                            //     backgroundColor: '#d1d5db',
                            // },
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            display: 'flex',
                            flexWrap: 'nowrap',
                            overflowX: 'auto',
                            padding: '0',
                            scrollbarWidth: 'none', // Firefox
                            '::-webkit-scrollbar': {
                                display: 'none', // Chrome/Safari
                            },
                        }),
                        multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#a78bfa',
                            borderRadius: '12px',
                            margin: '0 2px',
                            padding: '0 4px',
                            display: 'flex',
                            alignItems: 'center',
                            maxWidth: '100px', // Limit tag width
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            color: 'white',
                            fontSize: '12px',
                            padding: '2px 4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '70px', // Ensure text doesn't overflow
                        }),
                        multiValueRemove: (base) => ({
                            ...base,
                            color: 'white',
                            padding: '0 4px',
                            ':hover': {
                                backgroundColor: '#7c3aed',
                                color: 'white',
                            },
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: '#4b5563',
                            fontSize: '14px',
                            marginLeft: '8px',
                        }),
                        input: (base) => ({
                            ...base,
                            color: '#1f2937',
                            fontSize: '14px',
                            margin: '0',
                            padding: '0',
                        }),
                        menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginTop: '4px',
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected ? '#a78bfa' : isFocused ? '#f3e8ff' : 'white',
                            color: isSelected ? 'white' : '#1f2937',
                            fontSize: '14px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            ':active': {
                                backgroundColor: '#7c3aed',
                                color: 'white',
                            },
                        }),
                        indicatorsContainer: (base) => ({
                            ...base,
                            padding: '0 4px',
                        }),
                        clearIndicator: (base) => ({
                            ...base,
                            color: '#6b7280',
                            padding: '0 4px 2px 4px',
                            ':hover': {
                                color: '#1f2937',
                            },
                        }),
                        dropdownIndicator: (base) => ({
                            ...base,
                            color: '#6b7280',
                            padding: '4px',
                            ':hover': {
                                color: '#1f2937',
                            },
                        }),
                    }}
                />
            </div>
            <Tooltip id="sort-tooltip" />
        </>
    );
}
