/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import Image from 'next/image';
import GoToTop from '@/components/GoToTop';
import { Product, Prisma, Category, Status } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';
import FilterDropdown from '@/components/admin/FilterDropdown';
import ExportButton from '@/components/admin/ExportButton';
import { exportProducts } from '@/lib/actions/product.action';
import { deleteSelectedProducts } from '@/components/admin/DeleteSelectedButton';
import { twMerge } from 'tailwind-merge';
import { getTranslations } from 'next-intl/server';
import ReloadButton from '@/components/admin/ReloadButton';

type ProductList = Product & { images: { url: string }[] } & { category: Category } & { status: Status };

export default async function ProductListPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const t = await getTranslations('ProductListAdmin');

    const productSortOptions = [
        { value: 'name-asc', label: 'A-Z' },
        { value: 'name-desc', label: 'Z-A' },
        { value: 'date-desc', label: t('latestRelease') },
        { value: 'date-asc', label: t('oldRelease') },
    ];

    const { page, sort, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.ProductWhereInput = {};
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
    const orderBy: Prisma.ProductOrderByWithRelationInput[] = sortValues.map((sortValue) => {
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
        prisma.product.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            include: {
                images: {
                    select: { url: true },
                },
                category: {
                    select: { id: true, name: true },
                },
                status: {
                    select: { name: true },
                },
            },
            orderBy,
        }),
        prisma.product.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader itemIds={data.map((item) => item.id)} />, accessor: 'check' },
        { header: t('image'), accessor: 'img' },
        { header: t('name'), accessor: 'name', className: 'hidden md:table-cell' },
        { header: t('description'), accessor: 'description', className: 'hidden md:table-cell' },
        { header: t('category'), accessor: 'category', className: 'hidden md:table-cell' },
        { header: t('status'), accessor: 'status', className: 'hidden md:table-cell' },
    ];

    const renderRow = (item: ProductList) => (
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
            <td className="hidden md:table-cell py-2 max-w-[80px]">
                <span className="line-clamp-2 pr-2">{item.name}</span>
            </td>
            <td className="hidden md:table-cell max-w-[100px] py-2">
                <span className="line-clamp-2 pr-2">{item.description || '-'}</span>
            </td>
            <td className="hidden md:table-cell py-2">{item.category.name}</td>
            <td className="hidden md:table-cell py-2">
                <span
                    className={twMerge(
                        'p-1 px-2 rounded-lg',
                        item.status.name === 'In stock' ? 'bg-teal-400 text-white' : 'bg-rose-400 text-white',
                    )}
                >
                    {t(`${item.status.name}`)}
                </span>
            </td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <FormContainer table="product" type="details" data={item} />
                    <FormContainer table="product" type="update" data={item} />
                    <FormContainer table="product" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">{t('allProducts')}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/* Filter Dropdown */}
                            <FilterDropdown
                                currentSort={currentSort}
                                sortOptions={productSortOptions}
                                entityName={t('product')}
                            />
                            <ExportButton exportAction={exportProducts} entityName={t('product')} />
                            <ReloadButton />
                            <FormContainer table="product" type="create" />
                            <DeleteSelectedButtonClient
                                deleteAction={deleteSelectedProducts}
                                entityName={t('product')}
                            />
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
