/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import Image from 'next/image';
import GoToTop from '@/components/GoToTop';
import { Category, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';
import FilterDropdown from '@/components/admin/FilterDropdown';
import ExportButton from '@/components/admin/ExportButton';
import { exportCategories } from '@/lib/actions/category.action';
import { deleteSelectedCategories } from '@/components/admin/DeleteSelectedButton';

type CategoryList = Category & { images: { url: string }[] };

const categorySortOptions = [
    { value: 'name-asc', label: 'A-Z' },
    { value: 'name-desc', label: 'Z-A' },
    { value: 'date-desc', label: 'Latest Release' },
    { value: 'date-asc', label: 'Oldest Release' },
];

export default async function CategoryListPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const { page, sort, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.CategoryWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.name = { contains: value, mode: 'insensitive' };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const sortValues = currentSort.split(',').filter((value) => value);
    const orderBy: Prisma.CategoryOrderByWithRelationInput[] = sortValues.map((sortValue) => {
        switch (sortValue.trim()) {
            case 'name-asc':
                return { name: 'asc' };
            case 'name-desc':
                return { name: 'desc' };
            case 'date-asc':
                return { createdDate: 'asc' };
            case 'date-desc':
            default:
                return { createdDate: 'desc' };
        }
    });

    const [data, count] = await prisma.$transaction([
        prisma.category.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            include: {
                images: {
                    select: { url: true },
                    take: 1,
                },
            },
            orderBy,
        }),
        prisma.category.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader itemIds={data.map((item) => item.id)} />, accessor: 'check' },
        { header: 'Image', accessor: 'img' },
        { header: 'Name', accessor: 'name', className: 'hidden md:table-cell' },
        { header: 'Description', accessor: 'description', className: 'hidden md:table-cell' },
    ];

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
                <div className="flex items-center gap-2">
                    {/* <Link href={`/list/categories/${item.id}`}>
                        <button className="size-7 flex items-center justify-center rounded-full bg-violet-400">
                            <PiEyeBold width={16} height={16} className="text-white left-half-px" />
                        </button>
                    </Link> */}
                    <FormContainer table="category" type="update" data={item} />
                    <FormContainer table="category" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">All Categories</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/* Filter Dropdown */}
                            <FilterDropdown
                                currentSort={currentSort}
                                sortOptions={categorySortOptions}
                                entityName="Category"
                            />
                            <ExportButton exportAction={exportCategories} entityName="Category" />
                            <FormContainer table="category" type="create" />
                            <DeleteSelectedButtonClient deleteAction={deleteSelectedCategories} entityName="Category" />
                        </div>
                    </div>
                </div>
                <div id="table-container">
                    <Table columns={columns} renderRow={renderRow} data={data} />
                </div>
                {data.length > 0 && <Pagination page={p} count={count} />}
            </div>
        </>
    );
}
