// import prisma from "@/lib/prisma";
import prisma from '@/lib/prisma';
import FormModal from './FormModal';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormContainerProps = {
    table:
        | 'user'
        | 'category'
        | 'product'
        | 'brand'
        | 'color'
        | 'storage'
        | 'connectivity'
        | 'simSlot'
        | 'batteryHealth'
        | 'ram'
        | 'cpu'
        | 'screenSize'
        | 'type'
        | 'order'
        | 'role'
        | 'status';
    type: 'create' | 'update' | 'delete';
    data?: any;
    id?: number | string;
};

export default async function FormContainer({ table, type, data, id }: FormContainerProps) {
    let relatedData = {};

    if (type !== 'delete') {
        switch (table) {
            case 'product':
                const productCategories = await prisma.category.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { categories: productCategories };
                break;
            case 'user':
                const userRoles = await prisma.role.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { roles: userRoles };
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
}
