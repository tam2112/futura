/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import GoToTop from '@/components/GoToTop';
import { Promotion, Prisma, Status } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';
import FilterDropdown from '@/components/admin/FilterDropdown';
import ExportButton from '@/components/admin/ExportButton';
import { exportPromotions } from '@/lib/actions/promotion.action';
import { deleteSelectedPromotions } from '@/components/admin/DeleteSelectedButton';
import { getTranslations } from 'next-intl/server';
import { twMerge } from 'tailwind-merge';
import ReloadButton from '@/components/admin/ReloadButton';
// import '@/lib/server';

type PromotionList = Promotion & {
    categories: { name: string }[];
    products: { name: string }[];
    status: Status;
    remainingTime: number;
    durationType: string;
    endDate?: Date | null;
    endHours?: number | null;
    endMinutes?: number | null;
    endSeconds?: number | null;
};

const formatRemainingTime = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
};

export default async function PromotionListPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const t = await getTranslations('PromotionList');

    const promotionSortOptions = [
        { value: 'name-asc', label: 'A-Z' },
        { value: 'name-desc', label: 'Z-A' },
        { value: 'date-desc', label: t('latestRelease') },
        { value: 'date-asc', label: t('oldRelease') },
    ];

    const { page, sort, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.PromotionWhereInput = {};
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
    const orderBy: Prisma.PromotionOrderByWithRelationInput[] = sortValues.map((sortValue) => {
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
        prisma.promotion.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            include: {
                products: {
                    select: { id: true, name: true },
                },
                categories: {
                    select: { id: true, name: true },
                },
                status: {
                    select: { name: true },
                },
            },
            orderBy,
        }),
        prisma.promotion.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader itemIds={data.map((item) => item.id)} />, accessor: 'check' },
        { header: t('name'), accessor: 'name', className: 'hidden md:table-cell' },
        { header: t('status'), accessor: 'status', className: 'hidden md:table-cell' },
        { header: t('remainingTime'), accessor: 'remainingTime', className: 'hidden md:table-cell' },
    ];

    const renderRow = (item: PromotionList) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <td>
                <Checkbox id={item.id} />
            </td>
            <td className="hidden md:table-cell py-2 max-w-[80px]">
                <span className="line-clamp-2">{item.name}</span>
            </td>
            <td className="hidden md:table-cell py-2">
                <span
                    className={twMerge(
                        'p-1 px-2 rounded-lg',
                        item.status.name === 'In deals' ? 'bg-teal-400 text-white' : 'bg-rose-400 text-white',
                    )}
                >
                    {t(`${item.status.name}`)}
                </span>
            </td>
            <td className="hidden md:table-cell py-2">
                <span>{formatRemainingTime(item.remainingTime)}</span>
            </td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <FormContainer table="promotion" type="update" data={item} />
                    <FormContainer table="promotion" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            {/* Auto-refresh page every 5 seconds */}
            {/* <head>
                <meta httpEquiv="refresh" content="5" />
            </head> */}
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">{t('allPromotions')}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/* Filter Dropdown */}
                            <FilterDropdown
                                currentSort={currentSort}
                                sortOptions={promotionSortOptions}
                                entityName={t('promotion')}
                            />
                            <ExportButton exportAction={exportPromotions} entityName={t('promotion')} />
                            <ReloadButton />
                            <FormContainer table="promotion" type="create" />
                            <DeleteSelectedButtonClient
                                deleteAction={deleteSelectedPromotions}
                                entityName={t('promotion')}
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
