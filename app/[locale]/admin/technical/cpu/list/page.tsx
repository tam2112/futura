/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import GoToTop from '@/components/GoToTop';
import { Cpu, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';
import ExportButton from '@/components/admin/ExportButton';
import FilterTechnicalDropdown from '@/components/admin/FilterTechnicalDropdown';
import { exportCpus } from '@/lib/actions/technical/cpu.action';
import { deleteSelectedCpus } from '@/components/admin/DeleteSelectedButton';

type CpuList = Cpu;

const categorySortOptions = [
    { value: 'name-asc', label: 'A-Z' },
    { value: 'name-desc', label: 'Z-A' },
    { value: 'date-desc', label: 'Latest Release' },
    { value: 'date-asc', label: 'Oldest Release' },
];

export default async function CpuListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { page, sort, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.CpuWhereInput = {};
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
    const orderBy: Prisma.CpuOrderByWithRelationInput[] = sortValues.map((sortValue) => {
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
        prisma.cpu.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy,
        }),
        prisma.cpu.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader itemIds={data.map((item) => item.id)} />, accessor: 'check' },
        { header: 'Name', accessor: 'name', className: 'hidden md:table-cell' },
    ];

    const renderRow = (item: CpuList) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <td>
                <Checkbox id={item.id} />
            </td>
            <td className="hidden md:table-cell py-2">{item.name}</td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    {/* <Link href={`/list/categories/${item.id}`}>
                        <button className="size-7 flex items-center justify-center rounded-full bg-violet-400">
                            <PiEyeBold width={16} height={16} className="text-white left-half-px" />
                        </button>
                    </Link> */}
                    <FormContainer table="cpu" type="update" data={item} />
                    <FormContainer table="cpu" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">All Cpus</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/* Filter Dropdown */}
                            <FilterTechnicalDropdown
                                currentSort={currentSort}
                                sortOptions={categorySortOptions}
                                entityName="Cpu"
                            />
                            <ExportButton exportAction={exportCpus} entityName="Cpu" />
                            <FormContainer table="cpu" type="create" />
                            <DeleteSelectedButtonClient deleteAction={deleteSelectedCpus} entityName="Cpu" />
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
