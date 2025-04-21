'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { deleteSelectedCategories } from './DeleteSelectedButton';
import Loader from '../Loader';
import { Tooltip } from 'react-tooltip';

export default function DeleteSelectedButtonClient() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hàm lấy danh sách selectedIds từ checkboxes
    const getSelectedIds = () => {
        const container = document.getElementById('category-table-form');
        if (!container) return [];
        const checkboxes = container.querySelectorAll('input[name="selectedIds"]:checked');
        return Array.from(checkboxes).map((checkbox) => (checkbox as HTMLInputElement).value);
    };

    const handleDelete = async (selectedIds: string[]) => {
        setIsLoading(true);

        // Delay 1.5 giây trước khi thực hiện xóa
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Gọi hàm deleteSelectedCategories với danh sách selectedIds
        const result = await deleteSelectedCategories(selectedIds);
        setIsLoading(false);

        if (result.success) {
            toast(result.count === 1 ? 'Category has been deleted' : `${result.count} categories have been deleted`);
            router.refresh();
        } else {
            toast.error(result.error || 'Failed to delete categories');
        }
    };

    // Hàm mở modal xác nhận
    const openConfirmModal = () => {
        const selectedIds = getSelectedIds();
        if (selectedIds.length === 0) {
            toast.error('Please select at least one category to delete.');
            return;
        }
        setIsModalOpen(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Hàm xác nhận xóa
    const confirmDelete = () => {
        const selectedIds = getSelectedIds();
        handleDelete(selectedIds);
        setIsModalOpen(false);
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
                    <Loader />
                </div>
            )}
            {/* Nút xóa */}
            <button
                type="button"
                className="size-8 flex items-center justify-center rounded-full bg-red-400 text-white disabled:opacity-50"
                onClick={openConfirmModal}
                disabled={isLoading}
                data-tooltip-id="delete-tooltip"
                data-tooltip-content="Delete selected categories"
            >
                <FiTrash2 width={14} height={14} />
            </button>
            <Tooltip id="delete-tooltip" />

            {/* Modal xác nhận */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
                        <p className="font-heading text-lg text-center font-medium">
                            All data will be lost. Are you sure you want to delete selected categories?
                        </p>
                        <div className="flex justify-center mt-8 gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                                onClick={confirmDelete}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
