// components/admin/CategoryTable.tsx
'use client';

import { useState } from 'react';
import Table from '@/components/admin/table/Table';
import Image from 'next/image';
import FormContainer from '@/components/admin/form/FormContainer';
import Checkbox from '@/components/Checkbox';
import { twMerge } from 'tailwind-merge';
import { GrClose } from 'react-icons/gr';

type CategoryList = {
    id: number;
    name: string;
    description?: string;
    images: { url: string }[];
};

export default function CategoryTable({
    data,
    columns,
    relatedData,
}: {
    data: CategoryList[];
    columns: { header: React.ReactNode | string; accessor: string; className?: string }[];
    relatedData: any; // Có thể định nghĩa type cụ thể hơn nếu cần
}) {
    const [selectedCategory, setSelectedCategory] = useState<CategoryList | null>(null);

    const renderRow = (item: CategoryList) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <td>
                <Checkbox id={item.id} />
            </td>
            <td className="hidden md:table-cell py-2">
                <Image
                    src={item.images.length > 0 ? item.images[0].url : '/device-test-02.png'}
                    alt=""
                    width={40}
                    height={40}
                    className="md:hidden xl:block size-10 object-cover"
                />
            </td>
            <td className="hidden md:table-cell py-2">{item.name}</td>
            <td className="hidden md:table-cell py-2">{item.description || '-'}</td>
            <td className="py-2">
                <button
                    onClick={() => setSelectedCategory(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                >
                    Details
                </button>
            </td>
        </tr>
    );

    return (
        <>
            <Table columns={columns} renderRow={renderRow} data={data} />
            {selectedCategory && (
                <div
                    className={twMerge(
                        'fixed inset-0 top-0 left-0 w-full h-full bg-black/50 z-10 transition-opacity duration-500',
                    )}
                    onClick={() => setSelectedCategory(null)}
                />
            )}
            {selectedCategory && (
                <div
                    className={twMerge(
                        'fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-lg shadow-md z-20 p-6 min-w-[325px] transition-all duration-500',
                    )}
                >
                    <h2 className="text-lg font-semibold mb-4">Category Details</h2>
                    <p>
                        <strong>Name:</strong> {selectedCategory.name}
                    </p>
                    <p>
                        <strong>Description:</strong> {selectedCategory.description || '-'}
                    </p>
                    <div className="flex gap-4 mt-4">
                        <FormContainer
                            table="category"
                            type="update"
                            data={selectedCategory}
                            relatedData={relatedData}
                        />
                        <FormContainer
                            table="category"
                            type="delete"
                            id={selectedCategory.id}
                            relatedData={relatedData}
                        />
                    </div>
                    <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 text-gray-500">
                        <GrClose size={14} />
                    </button>
                </div>
            )}
        </>
    );
}
