import { LuLeaf } from 'react-icons/lu';
import { SlArrowLeft, SlArrowRight, SlSizeFullscreen } from 'react-icons/sl';
import deviceTest from '@/public/device-test-02.png';
import headphonesRed from '@/public/headphone-red.webp';
import Image from 'next/image';
import { CiDeliveryTruck } from 'react-icons/ci';

const controlTest = [
    { id: 1, title: 'Home' },
    { id: 2, title: 'Electronics' },
    { id: 3, title: 'Mobiles' },
    { id: 4, title: 'Smartphones' },
];

export default function Product() {
    return (
        <>
            <div className="bg-white pt-5 lg:pt-6">
                <div className="container">
                    {/* control */}
                    <div className="items-center gap-1 text-xs mb-2 hidden lg:flex">
                        {controlTest.map(({ id, title }) => (
                            <div key={id} className="flex items-center gap-1">
                                <div className="flex items-center">
                                    <span className=" underline underline-offset-1 transition text-gray-700/50 duration-150 ease-in-out hover:text-gray-700/100">
                                        {title}
                                    </span>
                                </div>
                                <span className="block text-gray-700/50">/</span>
                            </div>
                        ))}
                        <span className="max-w-[300px] truncate text-gray-700/100">Galaxy Z Flip5 (5G)</span>
                    </div>
                    {/* product */}
                    <div className="flex flex-col items-start lg:flex-row lg:gap-4">
                        {/* image */}
                        <section className="w-full select-none rounded-md transition-all duration-200 ease-in-out lg:sticky lg:w-1/2 lg:top-[9rem]">
                            <div className="rounded-md border-gray-200 px-5 sm:px-8 lg:border lg:p-4">
                                {/* heading */}
                                <div className="flex flex-wrap items-center justify-between lg:mb-10">
                                    {/* only mobile */}
                                    <div className="flex w-full items-center justify-between truncate lg:hidden">
                                        <div className="flex items-center text-xs">
                                            <div className="flex items-center">
                                                <div className="h-4 w-4">
                                                    <SlArrowLeft />
                                                </div>
                                                <div className=" underline underline-offset-1  pl-2">Smartphone</div>
                                            </div>
                                        </div>
                                        <div className="text-sm lg:hidden">
                                            <span className="mr-2 text-xs">1,654 Sold</span>
                                            <span className="text-xs font-bold text-gray-700 xs:py-1 xs:text-xs ">
                                                <span>
                                                    <span className="relative top-[2px] mr-1 inline-flex items-center">
                                                        img
                                                    </span>
                                                    Selling Fast!
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    {/* ... */}
                                    <div className="mr-3 hidden truncate lg:block">
                                        <div className="flex items-center gap-1.5 rounded-md bg-[#ECFCF5] px-3 py-1.5 text-xs text-[#1D6C49]">
                                            <div className="h-3.5 w-3.5 shrink-0">
                                                <LuLeaf size={15} />
                                            </div>
                                            Sustainable
                                            <span className="hidden xs:inline-block">choice</span>
                                        </div>
                                    </div>
                                    <div className="hidden text-sm lg:block">
                                        <div className="mr-2 text-xs">1,654 Sold</div>
                                        <span className="text-xs font-bold text-gray-700 xs:py-1 xs:text-xs ">
                                            <span>
                                                <span className="relative top-[2px] mr-1 inline-flex items-center"></span>
                                                Selling Fast!
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                {/* body */}
                                <div className="hidden lg:block">
                                    <div className="flex items-center">
                                        {/* image selection */}
                                        <div className="hidden flex-col items-center lg:flex">
                                            <div className="hide-scrollbar flex  flex-col gap-3 overflow-y-auto">
                                                <button className="rounded-md border p-1.5 transition duration-150 ease-in-out border-gray-700">
                                                    <div className="h-10 w-10">
                                                        <Image
                                                            src={deviceTest}
                                                            alt=""
                                                            width={50}
                                                            height={50}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </button>
                                                <button className="rounded-md border p-1.5 transition duration-150 ease-in-out border-gray-500 opacity-50 hover:opacity-100">
                                                    <div className="h-10 w-10">
                                                        <Image
                                                            src={deviceTest}
                                                            alt=""
                                                            width={50}
                                                            height={50}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </button>
                                                <button className="rounded-md border p-1.5 transition duration-150 ease-in-out border-gray-500 opacity-50 hover:opacity-100">
                                                    <div className="h-10 w-10">
                                                        <Image
                                                            src={deviceTest}
                                                            alt=""
                                                            width={50}
                                                            height={50}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </button>
                                                <button className="rounded-md border p-1.5 transition duration-150 ease-in-out border-gray-500 opacity-50 hover:opacity-100">
                                                    <div className="h-10 w-10">
                                                        <Image
                                                            src={deviceTest}
                                                            alt=""
                                                            width={50}
                                                            height={50}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                        {/* image selected */}
                                        <div className="relative mx-auto mb-3 flex h-48 w-48 items-center justify-center xs:mb-2 sm:h-72 sm:w-72 lg:mb-0 xl:h-80 xl:w-80">
                                            <Image
                                                src={headphonesRed}
                                                alt=""
                                                width={300}
                                                height={300}
                                                className="h-full min-h-full w-full min-w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* content */}
                        <section className="relative w-full px-5 py-2 sm:px-8 lg:w-1/2 lg:p-0">
                            <div className="relative z-20 mx-auto mt-1 w-full rounded bg-white px-0 sm:mt-2 lg:mt-0 lg:rounded-none lg:p-0">
                                <div className="mb-4 rounded-md border-gray-200 p-0 lg:border lg:p-4">
                                    <div className="flex items-center gap-3 lg:items-start">
                                        <div className="flex-1">
                                            <h1 className="flex-1 text-base font-extrabold leading-6 xs:text-lg lg:text-xl">
                                                Galaxy Z Flip5 (5G) - 256GB - Cream - Unlocked
                                            </h1>
                                        </div>
                                        <div className="hidden lg:block">
                                            <div>
                                                <div className="flex items-center justify-end">
                                                    <h2 className="block text-xl font-bold leading-tight text-gray-700">
                                                        $432
                                                        <sup style={{ top: '-0.4em' }}>. 15</sup>
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden w-full items-center gap-3 lg:flex">
                                        <div className="grid flex-1 grid-cols-1 gap-1.5 py-0.5">
                                            <button className="sm:text-base font-bold p-0 h-11 sm:h-auto text-sm xs:text-base sm:p-3 my-1 rounded-md duration-200 ease-in-out hover:opacity-90 disabled:opacity-70 bg-gradient-light hover:shadow-lg">
                                                Add to Cart
                                            </button>
                                        </div>
                                        <div className="w-[118px]">
                                            <button className="group flex h-[48px] w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 px-3 leading-3 flex-col justify-center lg:flex-row lg:justify-start">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#1f2323"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-[18px] w-[18px] transition-all duration-300 ease-in-out group-hover:fill-gray-700"
                                                >
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                                <div className="-mt-1 text-center text-[10px] lg:mt-0">
                                                    <span className="mr-0.5">Add to List</span>
                                                </div>
                                            </button>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '1px',
                                                    height: '1px',
                                                    padding: '0px',
                                                    margin: '-1px',
                                                    overflow: 'hidden',
                                                    clip: 'rect(0px, 0px, 0px, 0px)',
                                                    whiteSpace: 'nowrap',
                                                    borderWidth: '0px',
                                                    display: 'none',
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="mt-3 hidden lg:block">
                                        {/* first */}
                                        <div className="flex w-full justify-around gap-1.5 text-xxs font-light sm:text-xs lg:justify-between mt-1 lg:mt-0">
                                            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left lg:items-center">
                                                <div className="relative h-5 w-5 shrink-0 sm:mr-2 sm:h-8 sm:w-8 lg:-mt-0 lg:mr-2 lg:h-6 lg:w-6">
                                                    <CiDeliveryTruck size={20} />
                                                </div>
                                                <div className="mt-2 leading-[1.1] sm:mt-0 sm:leading-tight">
                                                    <div className="relative">
                                                        <span>Get it by Mar 12 - 13</span>
                                                        <br className="md:hidden" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left lg:items-center">
                                                <div className="relative h-5 w-5 shrink-0 sm:mr-2 sm:h-8 sm:w-8 lg:-mt-0 lg:mr-2 lg:h-6 lg:w-6">
                                                    <CiDeliveryTruck size={20} />
                                                </div>
                                                <div className="mt-2 leading-[1.1] sm:mt-0 sm:leading-tight">
                                                    <div className="relative">
                                                        <span>Get it by Mar 12 - 13</span>
                                                        <br className="md:hidden" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left lg:items-center">
                                                <div className="relative h-5 w-5 shrink-0 sm:mr-2 sm:h-8 sm:w-8 lg:-mt-0 lg:mr-2 lg:h-6 lg:w-6">
                                                    <CiDeliveryTruck size={20} />
                                                </div>
                                                <div className="mt-2 leading-[1.1] sm:mt-0 sm:leading-tight">
                                                    <div className="relative">
                                                        <span>Get it by Mar 12 - 13</span>
                                                        <br className="md:hidden" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* second */}
                                        <div className="mb-4 rounded-md border-gray-200 p-0 lg:border lg:p-4">
                                            <div className="mb-4">
                                                <h3 className="mb-1 flex text-[10px] font-bold uppercase text-gray-700 lg:font-normal">
                                                    Carrier
                                                </h3>
                                                <div className="gap-2 grid grid-cols-3 md:grid-cols-5">
                                                    <div className="false">
                                                        <div className="h-full w-full flex items-center justify-center leading-3 cursor-pointer py-4 lg:py-3 bg-white text-center text-[10px] sm:text-xs border hover:border-gray-700 rounded relative bg-white text-gray-700 !border-gray-700 !lg:border-gray-700 font-bold">
                                                            Unlocked
                                                        </div>
                                                    </div>
                                                    <div className="false">
                                                        <div className="h-full w-full flex items-center justify-center leading-3 cursor-pointer py-4 lg:py-3 bg-white text-center text-[10px] sm:text-xs border hover:border-gray-700 rounded relative bg-white text-gray-700 !border-gray-700 !lg:border-gray-700 font-bold">
                                                            Unlocked
                                                        </div>
                                                    </div>
                                                    <div className="false">
                                                        <div className="h-full w-full flex items-center justify-center leading-3 cursor-pointer py-4 lg:py-3 bg-white text-center text-[10px] sm:text-xs border hover:border-gray-700 rounded relative bg-white text-gray-700 !border-gray-700 !lg:border-gray-700 font-bold">
                                                            Unlocked
                                                        </div>
                                                    </div>
                                                    <div className="false">
                                                        <div className="h-full w-full flex items-center justify-center leading-3 cursor-pointer py-4 lg:py-3 bg-white text-center text-[10px] sm:text-xs border hover:border-gray-700 rounded relative bg-white text-gray-700 !border-gray-700 !lg:border-gray-700 font-bold">
                                                            Unlocked
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* third */}
                                        <div className="mt-4">
                                            <h3 className="mb-1 text-lg font-bold">Shipping options</h3>
                                            <div className="border border-gray-200 p-4 text-xs xs:text-xs lg:text-sm rounded-t-md">
                                                <div className="flex flex-col">
                                                    <div className="flex flex-wrap-reverse items-center justify-between gap-3"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* four */}
                                        <div className="mt-4 bg-white text-gray-700">
                                            <h3 className="mb-1 text-lg font-bold">About this item</h3>
                                            <div className="mb-4 rounded-md border border-gray-200">
                                                <div className="border-b border-gray-200 bg-[#F6F6F6] text-sm last:border-b-0">
                                                    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-6">
                                                        <div className="flex items-start overflow-hidden">
                                                            <div className="mr-2 h-5 w-5 shrink-0">
                                                                <SlSizeFullscreen size={20} className="" />
                                                            </div>
                                                            <span className="two-line-ellipsis">6.7 inches</span>
                                                        </div>
                                                        <div className="flex items-start overflow-hidden">
                                                            <div className="mr-2 h-5 w-5 shrink-0">
                                                                <SlSizeFullscreen size={20} className="size-full" />
                                                            </div>
                                                            <span className="two-line-ellipsis">6.7 inches</span>
                                                        </div>
                                                        <div className="flex items-start overflow-hidden">
                                                            <div className="mr-2 h-5 w-5 shrink-0">
                                                                <SlSizeFullscreen size={20} className="size-full" />
                                                            </div>
                                                            <span className="two-line-ellipsis">6.7 inches</span>
                                                        </div>
                                                        <div className="flex items-start overflow-hidden">
                                                            <div className="mr-2 h-5 w-5 shrink-0">
                                                                <SlSizeFullscreen size={20} className="size-full" />
                                                            </div>
                                                            <span className="two-line-ellipsis">6.7 inches</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-b border-gray-200 text-sm last:border-b-0">
                                                    <button className="flex w-full items-center justify-between p-4">
                                                        <h3 className="font-bold">Specifications</h3>
                                                        <div className="h-3 w-3 rotate-90">
                                                            <SlArrowRight size={25} />
                                                        </div>
                                                    </button>
                                                    <div className="overflow-auto transition-all duration-500 ease-in-out max-h-0">
                                                        <div className="px-4 py-2 odd:bg-gray-100">
                                                            <h4 className="font-bold">Model Name</h4>
                                                            <div>
                                                                <span className="block">
                                                                    Samsung Galaxy Z Flip5 (5G)
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button className="px-4 py-2 text-[#0D6EFD] underline">
                                                            See More
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-sm">
                                                    <button className="flex w-full items-center justify-between gap-3 p-4">
                                                        <h3 className="text-left font-bold">
                                                            Certified Quality & Packaging
                                                        </h3>
                                                        <div className="h-3 w-3 rotate-90">
                                                            <SlArrowRight size={25} />
                                                        </div>
                                                    </button>
                                                    <div className="overflow-auto transition-all duration-500 ease-in-out max-h-0">
                                                        <div className="flex flex-col bg-white px-4 pb-4 text-[14px]">
                                                            <div className="w-full">
                                                                <p className="text-sm">
                                                                    Certified Refurbished & Affordable Smartphones
                                                                </p>
                                                                <br />
                                                                <p className="text-sm">
                                                                    {' '}
                                                                    At Reebelo, you will always find high-quality,
                                                                    certified refurbished electronics tested by our
                                                                    expert refurbishing partners. These pre-owned
                                                                    products are professionally cleaned and inspected.
                                                                    Refurbished with Reebelo guarantees buyer
                                                                    satisfaction, battery health, and reduced negative
                                                                    impact on the environment.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="container">
                    <div></div>
                    <div className="relative z-0 py-8">
                        <div>
                            <div>
                                <h2 className="flex items-center text-lg font-semibold md:text-xl">
                                    You May Also Like
                                </h2>
                                <div className="relative mt-3 sm:mt-4 md:mt-5">
                                    <div>
                                        <div>
                                            <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border bg-white">
                                                <div className="block w-full px-2 py-4 xs:px-3 sm:py-5">
                                                    <div className="relative pb-[75%]">
                                                        <div className="absolute left-0 top-1/2 h-3/4 w-full -translate-y-1/2">
                                                            <div>
                                                                <Image src={deviceTest} alt="" sizes="100vw" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-center text-xs font-semibold text-gray-700 xxs:text-sm">
                                                        Samsung Galaxy S22 Ultra (5G)
                                                    </h3>
                                                    <div className="text-center text-xs text-gray-700">
                                                        From $295.00
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
