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
import { PiTrash } from 'react-icons/pi';
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

const deleteActionMap = {
    // main actions
    category: deleteCategory,
    user: deleteUser,
    role: deleteCategory,

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
    loading: () => <Loader />,
});
const RoleForm = dynamic(() => import('./content/RoleForm'), {
    loading: () => <h1>Loading..</h1>,
});

// technical forms
const BrandForm = dynamic(() => import('./content/technical/BrandForm'), {
    loading: () => <Loader />,
});
const ColorForm = dynamic(() => import('./content/technical/ColorForm'), {
    loading: () => <Loader />,
});
const StorageForm = dynamic(() => import('./content/technical/StorageForm'), {
    loading: () => <Loader />,
});
const ConnectivityForm = dynamic(() => import('./content/technical/ConnectivityForm'), {
    loading: () => <Loader />,
});
const SimSlotForm = dynamic(() => import('./content/technical/SimSlotForm'), {
    loading: () => <Loader />,
});
const BatteryHealthForm = dynamic(() => import('./content/technical/BatteryHealthForm'), {
    loading: () => <Loader />,
});
const RamForm = dynamic(() => import('./content/technical/RamForm'), {
    loading: () => <Loader />,
});
const CpuForm = dynamic(() => import('./content/technical/CpuForm'), {
    loading: () => <Loader />,
});
const ScreenSizeForm = dynamic(() => import('./content/technical/ScreenSizeForm'), {
    loading: () => <Loader />,
});
const TypeForm = dynamic(() => import('./content/technical/TypeForm'), {
    loading: () => <Loader />,
});

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: 'create' | 'update',
        data?: any,
        relatedData?: any,
    ) => JSX.Element;
} = {
    // main
    category: (setOpen, type, data, relatedData) => (
        <CategoryForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    role: (setOpen, type, data, relatedData) => (
        <RoleForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),

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

    const [open, setOpen] = useState(false);

    const Form = () => {
        const [state, formAction] = useFormState(deleteActionMap[table], { success: false, error: false });

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast(`${table} has been deleted`);
                setOpen(false);
                router.refresh();
            }
        }, [state, router]);

        return type === 'delete' && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="text | number" name="id" value={id} hidden />
                <h2 className="font-heading text-lg text-center font-medium">
                    All data will be lost. Are you sure you want to delete this {table}?
                </h2>
                <button className="bg-rose-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Delete
                </button>
            </form>
        ) : type === 'create' || type === 'update' ? (
            // <CategoryForm type="create" data={data} setOpen={setOpen} />
            forms[table](setOpen, type, data, relatedData)
        ) : (
            'Form not found'
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
                    <span>Add</span>
                </button>
            ) : type === 'update' ? (
                <button
                    onClick={() => setOpen(true)}
                    className="size-7 flex items-center justify-center rounded-full bg-amber-400"
                >
                    <CiEdit width={16} height={16} className="text-white" />
                </button>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="size-7 flex items-center justify-center rounded-full bg-rose-400"
                >
                    <PiTrash width={16} height={16} className="text-white" />
                </button>
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
                    <div className="min-w-[325px] px-8 py-6">
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
