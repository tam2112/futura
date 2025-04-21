import FormContainer from '@/components/admin/form/FormContainer';
import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Pagination from '@/sections/collections/Pagination';
import { Role, Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { PiEyeBold } from 'react-icons/pi';

type RoleList = Role;

export default async function RoleListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const columns = [{ header: 'Name', accessor: 'name', className: 'hidden md:table-cell' }];

    const renderRow = (item: RoleList) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="hidden md:table-cell">{item.name}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/categories/${item.id}`}>
                        <button className="size-7 flex items-center justify-center rounded-full bg-primary/80">
                            <PiEyeBold width={16} height={16} className="text-white" />
                        </button>
                    </Link>
                    <FormContainer table="role" type="update" data={item} />
                    <FormContainer table="role" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.RoleWhereInput = {};

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
        prisma.role.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.role.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Roles</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="size-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="size-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        <FormContainer table="role" type="create" />
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
}
