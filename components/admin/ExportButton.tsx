'use client';

import { useState } from 'react';
import { CiSaveDown1 } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import Loader from '../Loader';
import { useTranslations } from 'next-intl';

type ExportData = Record<string, unknown>;

type ExportButtonProps<T extends ExportData = ExportData> = {
    exportAction: () => Promise<{
        success: boolean;
        data?: T[];
        error?: string;
    }>;
    entityName?: string; // Optional, for toast messages (e.g., "Categories", "Products")
};

export default function ExportButton<T extends ExportData = ExportData>({
    exportAction,
    entityName = 'Items',
}: ExportButtonProps<T>) {
    const t = useTranslations('ExportInAdmin');

    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        if (isLoading) return; // Prevent multiple clicks
        setIsLoading(true);

        try {
            const response = await exportAction();

            if (!response.success || !response.data) {
                throw new Error(response.error || `Failed to fetch ${entityName.toLowerCase()}`);
            }

            // Create worksheet from data
            const worksheet = XLSX.utils.json_to_sheet(response.data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, entityName);

            // Set column widths (dynamic based on data keys)
            const columns = response.data.length > 0 ? Object.keys(response.data[0]) : [];
            worksheet['!cols'] = columns.map(() => ({ wch: 20 })); // Default width for all columns

            // Add delay of 1.5 seconds
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Trigger download
            XLSX.writeFile(workbook, `${entityName.toLowerCase()}.xlsx`);
            toast(t('exportSuccess', { entityName: entityName }));
        } catch (error) {
            console.error('Export error:', error);
            toast.error(t('exportFailed', { entityName }));
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
                data-tooltip-content={t('exportToExcel')}
            >
                <CiSaveDown1 width={14} height={14} />
            </button>
            <Tooltip id="export-tooltip" />
        </>
    );
}
