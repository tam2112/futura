/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import Image from 'next/image';
import GoToTop from '@/components/GoToTop';
import { Delivery, Order, Prisma, Product, Status, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import FormContainer from '@/components/admin/form/FormContainer';
import FilterDropdown from '@/components/admin/FilterDropdown';
import ExportButton from '@/components/admin/ExportButton';
import { exportOrders } from '@/lib/actions/order.action';
import { twMerge } from 'tailwind-merge';
import ReloadButton from '@/components/admin/ReloadButton';
import { getTranslations } from 'next-intl/server';

type OrderList = Order & { product: Product & { images: { url: string }[] } } & { status: Status } & {
    deliveryInfo: Delivery;
} & { user: User };

export default async function OrderListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const t = await getTranslations('OrderList');

    const orderSortOptions = [
        { value: 'date-desc', label: t('latestRelease') },
        { value: 'date-asc', label: t('oldRelease') },
    ];

    const { page, sort, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.OrderWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        if (query.user) {
                            query.user.fullName = { contains: value, mode: 'insensitive' };
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const sortValues = currentSort.split(',').filter((value) => value);
    const orderBy: Prisma.OrderOrderByWithRelationInput[] = sortValues.map((sortValue) => {
        switch (sortValue.trim()) {
            case 'date-asc':
                return { createdDate: 'asc' };
            case 'date-desc':
            default:
                return { createdDate: 'desc' };
        }
    });

    const [data, count] = await prisma.$transaction([
        prisma.order.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            include: {
                product: {
                    select: { name: true, price: true, priceWithDiscount: true, images: { select: { url: true } } },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy,
        }),
        prisma.order.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: t('productImage'), accessor: 'productImage' },
        { header: t('user'), accessor: 'user' },
        { header: t('productName'), accessor: 'productName', className: 'hidden md:table-cell' },
        { header: t('quantity'), accessor: 'quantity', className: 'hidden md:table-cell' },
        { header: t('status'), accessor: 'status' },
        { header: t('date'), accessor: 'createdDate' },
    ];

    const renderRow = (item: OrderList) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <td className="py-2">
                <Image
                    src={item.product.images.length > 0 ? item.product.images[0].url : '/device-test-02.png'}
                    alt=""
                    width={40}
                    height={40}
                    className="md:hidden xl:block size-10 object-cover"
                />
            </td>
            <td className="py-2">{item.user.fullName}</td>
            <td className="hidden md:table-cell py-2 max-w-[80px]">
                <span className="line-clamp-2 pr-2">{item.product.name}</span>
            </td>
            <td className="py-2">{item.quantity}</td>
            <td className="py-2">
                <span
                    className={twMerge(
                        'py-1 px-2 text-sm rounded-md text-white',
                        item.status.name === 'Pending'
                            ? 'bg-amber-100 text-yellow-800'
                            : item.status.name === 'Out for delivery'
                            ? 'bg-sky-100 text-blue-800'
                            : item.status.name === 'Delivered'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-rose-100 text-rose-800',
                    )}
                >
                    {t(`${item.status.name}`)}
                </span>
            </td>
            <td className="py-2">{item.createdDate.toLocaleDateString()}</td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <FormContainer table="order" type="details" data={item} />
                    <FormContainer table="order" type="update" data={item} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">{t('allOrders')}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/* Filter Dropdown */}
                            <FilterDropdown
                                currentSort={currentSort}
                                sortOptions={orderSortOptions}
                                entityName={t('order')}
                            />
                            <ExportButton exportAction={exportOrders} entityName={t('order')} />
                            <ReloadButton />
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
