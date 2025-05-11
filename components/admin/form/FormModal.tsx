/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// @ts-ignore
import { useFormState } from 'react-dom';
import { FormContainerProps } from './FormContainer';
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
        data?: any,
        relatedData?: any,
    ) => JSX.Element;
} = {
    // main
    category: (setOpen, type, data, relatedData) => (
        <CategoryForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    product: (setOpen, type, data, relatedData) => {
        if (type === 'details') {
            return <ProductDetailsForm data={data} setOpen={setOpen} relatedData={relatedData} />;
        }
        return <ProductForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />;
    },
    user: (setOpen, type, data, relatedData) => (
        <UserForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    role: (setOpen, type, data, relatedData) => (
        <RoleForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    promotion: (setOpen, type, data, relatedData) => (
        <PromotionForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    status: (setOpen, type, data, relatedData) => (
        <StatusForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    order: (setOpen, type, data, relatedData) => {
        if (type === 'details') {
            return <OrderDetailsForm data={data} setOpen={setOpen} relatedData={relatedData} />;
        }
        if (type === 'update') {
            return <OrderUpdateForm data={data} setOpen={setOpen} relatedData={relatedData} />;
        }
        return <div>Form not available</div>;
    },

    // technical
    brand: (setOpen, type, data, relatedData) => (
        <BrandForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    color: (setOpen, type, data, relatedData) => (
        <ColorForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    storage: (setOpen, type, data, relatedData) => (
        <StorageForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    connectivity: (setOpen, type, data, relatedData) => (
        <ConnectivityForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    simSlot: (setOpen, type, data, relatedData) => (
        <SimSlotForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    batteryHealth: (setOpen, type, data, relatedData) => (
        <BatteryHealthForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    ram: (setOpen, type, data, relatedData) => (
        <RamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    cpu: (setOpen, type, data, relatedData) => (
        <CpuForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    screenSize: (setOpen, type, data, relatedData) => (
        <ScreenSizeForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    type: (setOpen, type, data, relatedData) => (
        <TypeForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
};

export default function FormModal({ table, type, data, id, relatedData }: FormContainerProps & { relatedData?: any }) {
    // const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
    const t = useTranslations('FormModal');

    const [open, setOpen] = useState(false);

    const Form = () => {
        const [state, formAction] = useFormState(deleteActionMap[table], { success: false, error: false });

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
