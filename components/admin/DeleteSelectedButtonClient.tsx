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
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái để mở/đóng modal

    const handleDelete = async (formData: FormData) => {
        setIsLoading(true);

        // Delay 1.5 giây (1500ms) trước khi thực hiện xóa
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const result = await deleteSelectedCategories(formData);
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
        const form = document.getElementById('category-table-form') as HTMLFormElement;
        const selectedIds = new FormData(form).getAll('selectedIds');
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
        const form = document.getElementById('category-table-form') as HTMLFormElement;
        handleDelete(new FormData(form));
        setIsModalOpen(false); // Đóng modal sau khi xác nhận
    };

    return (
        <>
            {isLoading && <Loader />}
            {/* Nút xóa */}
            <button
                type="button"
                className="size-8 flex items-center justify-center rounded-full bg-red-400 text-white disabled:opacity-50"
                onClick={openConfirmModal} // Mở modal khi nhấn nút
                disabled={isLoading}
                data-tooltip-id="delete-tooltip"
                data-tooltip-content="Xóa"
            >
                <FiTrash2 width={14} height={14} />
            </button>
            <Tooltip id="delete-tooltip" />

            {/* Modal xác nhận */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
                        {/* <h2 className="font-heading text-lg text-center font-medium">Confirm</h2> */}
                        <p className="font-heading text-lg text-center font-medium">
                            All data will be lost. Are you sure you want to delete selected categories?
                        </p>
                        <div className="flex justify-center mt-8 gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={closeModal} // Đóng modal khi nhấn Hủy
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                                onClick={confirmDelete} // Thực hiện xóa khi nhấn Xác nhận
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
