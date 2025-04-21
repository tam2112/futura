import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import Image from 'next/image';
import { CiFilter, CiSaveDown1 } from 'react-icons/ci';
import GoToTop from '@/components/GoToTop';
import { Brand, Category, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';

type BrandList = Brand & { images: { url: string }[] } & { category: Category };

export default async function BrandListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.BrandWhereInput = {};
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

    const [data, count] = await prisma.$transaction([
        prisma.brand.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            include: {
                images: {
                    select: { url: true },
                    take: 1,
                },
                category: true,
            },
        }),
        prisma.brand.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader categoryIds={data.map((item) => item.id)} />, accessor: 'check' },
        { header: 'Image', accessor: 'img' },
        { header: 'Name', accessor: 'name', className: 'hidden md:table-cell' },
        { header: 'Category', accessor: 'category', className: 'hidden md:table-cell' },
    ];

    const renderRow = (item: BrandList) => (
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
            <td className="hidden md:table-cell py-2">{item.category.name}</td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    {/* <Link href={`/list/categories/${item.id}`}>
                        <button className="size-7 flex items-center justify-center rounded-full bg-violet-400">
                            <PiEyeBold width={16} height={16} className="text-white left-half-px" />
                        </button>
                    </Link> */}
                    <FormContainer table="brand" type="update" data={item} />
                    <FormContainer table="brand" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">All Brands</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button className="size-8 flex items-center justify-center rounded-full bg-slate-200">
                                <CiFilter width={14} height={14} />
                            </button>
                            <button className="size-8 flex items-center justify-center rounded-full bg-slate-200">
                                <CiSaveDown1 width={14} height={14} />
                            </button>
                            <FormContainer table="brand" type="create" />
                            <DeleteSelectedButtonClient />
                        </div>
                    </div>
                </div>
                <form id="category-table-form">
                    <Table columns={columns} renderRow={renderRow} data={data} />
                </form>
                {data.length > 0 && <Pagination page={p} count={count} />}
            </div>
        </>
    );
}
