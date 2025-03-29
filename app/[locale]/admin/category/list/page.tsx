/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import { Link } from '@/navigation';
import Pagination from '@/sections/collections/Pagination';
import { allCategoriesData } from '@/temp/categoryData';
import Image from 'next/image';
import { CiEdit, CiFilter, CiSaveDown1 } from 'react-icons/ci';
import { PiEyeBold, PiTrash } from 'react-icons/pi';
import { BsPlusLg } from 'react-icons/bs';

export default function CategoryListPage() {
    const columns = [
        { header: 'Image', accessor: 'img' },
        { header: 'Name', accessor: 'name', className: 'hidden md:table-cell' },
        { header: 'Description', accessor: 'description', className: 'hidden md:table-cell' },
    ];

    const renderRow = (item: any) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <td className="hidden md:table-cell py-2">
                <Image
                    src={item.img || '/device-test-02.png'}
                    alt=""
                    width={40}
                    height={40}
                    className="md:hidden xl:block size-10 object-cover"
                />
            </td>
            <td className="hidden md:table-cell py-2">{item.name}</td>
            <td className="hidden md:table-cell py-2">{item.description || '-'}</td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <Link href={`/list/categories/${item.id}`}>
                        <button className="size-7 flex items-center justify-center rounded-full bg-teal-400">
                            <PiEyeBold width={16} height={16} className="text-white" />
                        </button>
                    </Link>
                    <Link href={`/category/update/${item.id}`}>
                        <button className="size-7 flex items-center justify-center rounded-full bg-amber-400">
                            <CiEdit width={16} height={16} className="text-white" />
                        </button>
                    </Link>
                    <button className="size-7 flex items-center justify-center rounded-full bg-rose-400">
                        <PiTrash width={16} height={16} className="text-white" />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Categories</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="size-8 flex items-center justify-center rounded-full bg-slate-200">
                            <CiFilter width={14} height={14} />
                        </button>
                        <button className="size-8 flex items-center justify-center rounded-full bg-slate-200">
                            <CiSaveDown1 width={14} height={14} />
                        </button>
                        <button className="bg-gradient-light font-semibold px-5 py-2 flex gap-1 items-center rounded-lg text-black/80">
                            <BsPlusLg width={16} height={16} />
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={allCategoriesData} />
            {/* PAGINATION */}
            <Pagination />
        </div>
    );
}
