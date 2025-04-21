'use client';

import { exportCategories } from '@/lib/actions/category.action';
import { useState } from 'react';
import { CiSaveDown1 } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import Loader from '../Loader';

export default function ExportButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        if (isLoading) return; // Prevent multiple clicks
        setIsLoading(true);

        try {
            const response = await exportCategories();

            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch categories');
            }

            // Create worksheet from data
            const worksheet = XLSX.utils.json_to_sheet(response.data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

            // Set column widths
            worksheet['!cols'] = [
                { wch: 20 }, // Name
                { wch: 40 }, // Description
                { wch: 60 }, // ImageURLs
                { wch: 20 }, // CreatedAt
            ];

            // Add delay of 1.5 seconds
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Trigger download
            XLSX.writeFile(workbook, 'categories.xlsx');
            toast('Categories exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export categories.');
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
            <button
                className="size-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-gradient-lighter transition-all duration-300 disabled:opacity-50"
                onClick={handleExport}
                disabled={isLoading}
                data-tooltip-id="export-tooltip"
                data-tooltip-content="Export to Excel"
            >
                <CiSaveDown1 width={14} height={14} />
            </button>
            <Tooltip id="export-tooltip" />
        </>
    );
}
