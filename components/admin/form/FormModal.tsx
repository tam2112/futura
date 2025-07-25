'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useFormState } from 'react-dom';
import { BsPlusLg } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { PiEyeBold, PiTrash } from 'react-icons/pi';
import { GrClose } from 'react-icons/gr';
import { toast } from 'react-toastify';

import Loader from '@/components/Loader';
import { twMerge } from 'tailwind-merge';

import { deleteUser } from '@/lib/actions/user.action';
import { deleteCategory } from '@/lib/actions/category.action';
import { deleteBrand } from '@/lib/actions/technical/brand.action';
import { deleteColor } from '@/lib/actions/technical/color.action';
import { deleteStorage } from '@/lib/actions/technical/storage.action';
import { deleteConnectivity } from '@/lib/actions/technical/connectivity.action';
import { deleteSimSlot } from '@/lib/actions/technical/sim-slot.action';
import { deleteBatteryHealth } from '@/lib/actions/technical/battery-health.action';
import { deleteRam } from '@/lib/actions/technical/ram.action';
import { deleteCpu } from '@/lib/actions/technical/cpu.action';
import { deleteScreenSize } from '@/lib/actions/technical/screen-size.action';
import { deleteType } from '@/lib/actions/technical/type.action';
import { deleteProduct } from '@/lib/actions/product.action';
import { deletePromotion } from '@/lib/actions/promotion.action';
import { deleteStatus } from '@/lib/actions/status.action';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';

// Define types for data and relatedData
type CategoryData = { id: string; name: string; description: string; images: { url: string }[] };
type ProductData = {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    brandId: string;
    colorId: string;
    storageId: string;
    connectivityId: string;
    simSlotId: string;
    batteryHealthId: string;
    ramId: string;
    cpuId: string;
    screenSizeId: string;
    typeId: string;
    images: { url: string }[];
};
type UserData = { id: string; fullName: string; email: string; password?: string; roleId: string };
type RoleData = { id: string; name: string };
type PromotionData = {
    id: string;
    name: string;
    percentageNumber: number;
    durationType: 'date' | 'hours' | 'minutes' | 'seconds';
    startDate?: string;
    endDate?: string;
    startHours?: number;
    endHours?: number;
    startMinutes?: number;
    endMinutes?: number;
    startSeconds?: number;
    endSeconds?: number;
    products?: { id: string; name: string }[];
    categories?: { id: string; name: string }[];
};
type StatusData = { id: string; name: string };
type OrderData = {
    product?: {
        name: string;
        price: number;
        images: { url: string }[];
    };
    quantity?: number;
    status?: {
        name: string;
    };
    deliveryInfo?: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        country: string;
        phone: string;
    }[];
};
type OrderUpdateData = {
    id: string;
    statusId: string;
    status?: {
        name: string;
    };
};
type BatteryHealthData = {
    id: string;
    title: string;
};
type BrandData = {
    id: string;
    name: string;
    images: { url: string }[];
};
type ColorData = {
    id: string;
    name: string;
    hex: string;
};
type ConnectivityData = {
    id: string;
    name: string;
};
type CpuData = {
    id: string;
    name: string;
};
type RamData = {
    id: string;
    title: string;
};
type ScreenSizeData = {
    id: string;
    name: string;
};
type SimSlotData = {
    id: string;
    title: string;
};
type StorageData = {
    id: string;
    name: string;
};
type TypeData = {
    id: string;
    name: string;
};

type FormData =
    | CategoryData
    | ProductData
    | UserData
    | RoleData
    | PromotionData
    | StatusData
    | OrderData
    | OrderUpdateData
    | BatteryHealthData
    | BrandData
    | ColorData
    | ConnectivityData
    | CpuData
    | RamData
    | ScreenSizeData
    | SimSlotData
    | StorageData
    | TypeData;

type ProductRelatedData = {
    categories: { id: string; name: string }[];
    brands: { id: string; name: string }[];
    colors: { id: string; name: string; hex: string }[];
    storages: { id: string; name: string }[];
    connectivities: { id: string; name: string }[];
    simSlots: { id: string; title: string }[];
    batteryHealths: { id: string; title: string }[];
    rams: { id: string; title: string }[];
    cpus: { id: string; name: string }[];
    screenSizes: { id: string; name: string }[];
    types: { id: string; name: string }[];
};
type UserRelatedData = { roles: { id: string; name: string }[] };
type PromotionRelatedData = {
    categories: { id: string; name: string }[];
    products: { id: string; name: string }[];
};
type FormRelatedData = ProductRelatedData | UserRelatedData | PromotionRelatedData | undefined;

// Update FormContainerProps
export interface FormContainerProps {
    table:
        | 'category'
        | 'product'
        | 'user'
        | 'role'
        | 'promotion'
        | 'status'
        | 'order'
        | 'brand'
        | 'color'
        | 'storage'
        | 'connectivity'
        | 'simSlot'
        | 'batteryHealth'
        | 'ram'
        | 'cpu'
        | 'screenSize'
        | 'type';
    type: 'create' | 'update' | 'delete' | 'details';
    data?: FormData;
    id?: string | number;
}

const deleteActionMap = {
    // main actions
    category: deleteCategory,
    product: deleteProduct,
    user: deleteUser,
    role: deleteCategory,
    promotion: deletePromotion,
    status: deleteStatus,

    // technical actions
    brand: deleteBrand,
    color: deleteColor,
    storage: deleteStorage,
    connectivity: deleteConnectivity,
    simSlot: deleteSimSlot,
    batteryHealth: deleteBatteryHealth,
    ram: deleteRam,
    cpu: deleteCpu,
    screenSize: deleteScreenSize,
    type: deleteType,
};

// main forms
const CategoryForm = dynamic(() => import('./content/CategoryForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const ProductForm = dynamic(() => import('./content/ProductForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const ProductDetailsForm = dynamic(() => import('./content/ProductDetailsForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const OrderDetailsForm = dynamic(() => import('./content/OrderDetailsForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const OrderUpdateForm = dynamic(() => import('./content/OrderUpdateForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const PromotionForm = dynamic(() => import('./content/PromotionForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const StatusForm = dynamic(() => import('./content/StatusForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const UserForm = dynamic(() => import('./content/UserForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const RoleForm = dynamic(() => import('./content/RoleForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});

// technical forms
const BrandForm = dynamic(() => import('./content/technical/BrandForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const ColorForm = dynamic(() => import('./content/technical/ColorForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const StorageForm = dynamic(() => import('./content/technical/StorageForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const ConnectivityForm = dynamic(() => import('./content/technical/ConnectivityForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const SimSlotForm = dynamic(() => import('./content/technical/SimSlotForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const BatteryHealthForm = dynamic(() => import('./content/technical/BatteryHealthForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const RamForm = dynamic(() => import('./content/technical/RamForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const CpuForm = dynamic(() => import('./content/technical/CpuForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const ScreenSizeForm = dynamic(() => import('./content/technical/ScreenSizeForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});
const TypeForm = dynamic(() => import('./content/technical/TypeForm'), {
    loading: () => (
        <div className="flex justify-center items-center">
            <Loader />
        </div>
    ),
});

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: 'create' | 'update' | 'details',
        data?: FormData,
        relatedData?: FormRelatedData,
    ) => JSX.Element;
} = {
    // main
    category: (setOpen, type, data, relatedData) => (
        <CategoryForm
            type={type}
            data={data as CategoryData}
            setOpen={setOpen}
            relatedData={relatedData as undefined}
        />
    ),
    product: (setOpen, type, data, relatedData) => {
        if (type === 'details') {
            return (
                <ProductDetailsForm
                    data={data as ProductData}
                    setOpen={setOpen}
                    relatedData={relatedData as ProductRelatedData}
                />
            );
        }
        return (
            <ProductForm
                type={type}
                data={data as ProductData}
                setOpen={setOpen}
                relatedData={relatedData as ProductRelatedData}
            />
        );
    },
    user: (setOpen, type, data, relatedData) => (
        <UserForm type={type} data={data as UserData} setOpen={setOpen} relatedData={relatedData as UserRelatedData} />
    ),
    role: (setOpen, type, data, relatedData) => (
        <RoleForm type={type} data={data as RoleData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    promotion: (setOpen, type, data, relatedData) => (
        <PromotionForm
            type={type}
            data={data as PromotionData}
            setOpen={setOpen}
            relatedData={relatedData as PromotionRelatedData}
        />
    ),
    status: (setOpen, type, data, relatedData) => (
        <StatusForm type={type} data={data as StatusData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    order: (setOpen, type, data, relatedData) => {
        if (type === 'details') {
            return (
                <OrderDetailsForm data={data as OrderData} setOpen={setOpen} relatedData={relatedData as undefined} />
            );
        }
        if (type === 'update') {
            return (
                <OrderUpdateForm
                    data={data as OrderUpdateData}
                    setOpen={setOpen}
                    relatedData={relatedData as undefined}
                />
            );
        }
        return <div>Form not available</div>;
    },

    // technical
    brand: (setOpen, type, data, relatedData) => (
        <BrandForm type={type} data={data as BrandData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    color: (setOpen, type, data, relatedData) => (
        <ColorForm type={type} data={data as ColorData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    storage: (setOpen, type, data, relatedData) => (
        <StorageForm type={type} data={data as StorageData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    connectivity: (setOpen, type, data, relatedData) => (
        <ConnectivityForm
            type={type}
            data={data as ConnectivityData}
            setOpen={setOpen}
            relatedData={relatedData as undefined}
        />
    ),
    simSlot: (setOpen, type, data, relatedData) => (
        <SimSlotForm type={type} data={data as SimSlotData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    batteryHealth: (setOpen, type, data, relatedData) => (
        <BatteryHealthForm
            type={type}
            data={data as BatteryHealthData}
            setOpen={setOpen}
            relatedData={relatedData as undefined}
        />
    ),
    ram: (setOpen, type, data, relatedData) => (
        <RamForm type={type} data={data as RamData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    cpu: (setOpen, type, data, relatedData) => (
        <CpuForm type={type} data={data as CpuData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
    screenSize: (setOpen, type, data, relatedData) => (
        <ScreenSizeForm
            type={type}
            data={data as ScreenSizeData}
            setOpen={setOpen}
            relatedData={relatedData as undefined}
        />
    ),
    type: (setOpen, type, data, relatedData) => (
        <TypeForm type={type} data={data as TypeData} setOpen={setOpen} relatedData={relatedData as undefined} />
    ),
};

export default function FormModal({ table, type, data, id, relatedData }: FormContainerProps & { relatedData?: any }) {
    // const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
    const t = useTranslations('FormModal');

    const [open, setOpen] = useState(false);

    const Form = () => {
        // const [state, formAction] = useFormState(deleteActionMap[table], { success: false, error: false });

        const deleteAction =
            table in deleteActionMap ? deleteActionMap[table as keyof typeof deleteActionMap] : undefined;
        const [state, formAction] = useFormState(
            deleteAction ?? (() => Promise.resolve({ success: false, error: false })),
            { success: false, error: false },
        );

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast(t('deleteSuccess', { table: t(`${table}`) }));
                setOpen(false);
                router.refresh();
            }
        }, [state, router]);

        return type === 'delete' && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="text | number" name="id" value={id} hidden />
                <h2 className="font-heading text-lg text-center font-medium">
                    {t('deleteConfirm', { table: t(`${table}`) })}
                </h2>
                <button className="bg-rose-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    {t('delete')}
                </button>
            </form>
        ) : type === 'create' || type === 'update' || type === 'details' ? (
            // <CategoryForm type="create" data={data} setOpen={setOpen} />
            forms[table](setOpen, type, data, relatedData)
        ) : (
            t('formNotFound')
        );
    };

    return (
        <>
            {type === 'create' ? (
                <button
                    onClick={() => setOpen(true)}
                    className="bg-gradient-light font-semibold px-5 py-2 flex gap-1 items-center rounded-lg text-black/80"
                >
                    <BsPlusLg width={16} height={16} />
                    <span>{t('add')}</span>
                </button>
            ) : type === 'update' ? (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        className="size-7 flex items-center justify-center rounded-full bg-amber-400"
                        data-tooltip-id="edit-icon-tooltip"
                        data-tooltip-content={t('editTooltip')}
                    >
                        <CiEdit width={16} height={16} className="text-white" />
                    </button>
                    <Tooltip id="edit-icon-tooltip" />
                </>
            ) : type === 'delete' ? (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        className="size-7 flex items-center justify-center rounded-full bg-rose-400"
                        data-tooltip-id="delete-icon-tooltip"
                        data-tooltip-content={t('deleteTooltip')}
                    >
                        <PiTrash width={16} height={16} className="text-white" />
                    </button>
                    <Tooltip id="delete-icon-tooltip" />
                </>
            ) : (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        className="size-7 flex items-center justify-center rounded-full bg-violet-400"
                        data-tooltip-id="details-icon-tooltip"
                        data-tooltip-content={t('detailsTooltip')}
                    >
                        <PiEyeBold width={16} height={16} className="text-white left-half-px" />
                    </button>
                    <Tooltip id="details-icon-tooltip" />
                </>
            )}
            {open && (
                <div
                    className={twMerge(
                        'fixed inset-0 top-0 left-0 w-full h-full bg-black/50 opacity-0 transition-opacity duration-500 z-10',
                        open && 'opacity-100',
                    )}
                    onClick={() => setOpen(false)}
                />
            )}
            {open && (
                <div
                    className={twMerge(
                        'fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 overflow-x-hidden hide-scrollbar bg-white rounded-lg shadow-md z-10 transition-all duration-500',
                        !open && 'invisible',
                    )}
                >
                    <div className="min-w-[600px] px-8 py-6">
                        <Form />
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
                            <GrClose size={14} />
                        </div>
                    </div>
                </div>
            )}
            {/* {open && (
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
                            <Image src="/close.png" alt="" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )} */}
        </>
    );
}
