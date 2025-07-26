// import prisma from "@/lib/prisma";
import prisma from '@/lib/prisma';
import FormModal from './FormModal';

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
        | 'status'
        | 'promotion';
    type: 'create' | 'update' | 'delete' | 'details';
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
                const productBrands = await prisma.brand.findMany({
                    select: { id: true, name: true },
                });
                const productColors = await prisma.color.findMany({
                    select: { id: true, name: true, hex: true },
                });
                const productStorages = await prisma.storage.findMany({
                    select: { id: true, name: true },
                });
                const productConnectivities = await prisma.connectivity.findMany({
                    select: { id: true, name: true },
                });
                const productSimSlots = await prisma.simSlot.findMany({
                    select: { id: true, title: true },
                });
                const productBatteryHealths = await prisma.batteryHealth.findMany({
                    select: { id: true, title: true },
                });
                const productRams = await prisma.ram.findMany({
                    select: { id: true, title: true },
                });
                const productCpus = await prisma.cpu.findMany({
                    select: { id: true, name: true },
                });
                const productScreenSizes = await prisma.screenSize.findMany({
                    select: { id: true, name: true },
                });
                const productTypes = await prisma.type.findMany({
                    select: { id: true, name: true },
                });
                relatedData = {
                    categories: productCategories,
                    brands: productBrands,
                    colors: productColors,
                    storages: productStorages,
                    connectivities: productConnectivities,
                    simSlots: productSimSlots,
                    batteryHealths: productBatteryHealths,
                    rams: productRams,
                    cpus: productCpus,
                    screenSizes: productScreenSizes,
                    types: productTypes,
                };
                break;
            case 'promotion':
                const promotionProducts = await prisma.product.findMany({
                    select: { id: true, name: true },
                });
                const promotionCategories = await prisma.category.findMany({
                    select: { id: true, name: true },
                });
                relatedData = {
                    products: promotionProducts,
                    categories: promotionCategories,
                };
                break;
            case 'user':
                const userRoles = await prisma.role.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { roles: userRoles };
                break;
            case 'order':
                const orderStatuses = await prisma.status.findMany({
                    select: { id: true, name: true },
                });
                const orderProducts = await prisma.product.findMany({
                    select: { images: { select: { url: true } }, id: true, name: true },
                });
                const orderUsers = await prisma.user.findMany({
                    select: { id: true, fullName: true, email: true },
                });
                const orderDeliveryInfos = await prisma.delivery.findMany({
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        street: true,
                        city: true,
                        country: true,
                    },
                });
                relatedData = {
                    statuses: orderStatuses,
                    products: orderProducts,
                    users: orderUsers,
                    deliveryInfos: orderDeliveryInfos,
                };
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
