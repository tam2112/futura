import deviceTest from '@/public/device-test-02.png';
import Image from 'next/image';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';

export default function CartItem() {
    return (
        <div className="select-none pt-2">
            <div className="flex gap-x-4 mb-2">
                {/* image */}
                <div className="flex justify-center items-center">
                    <Image src={deviceTest} alt="" width={90} height={90} />
                </div>
                {/* pizza info */}
                <div className="flex-1 flex flex-col gap-y-1">
                    {/* name */}
                    <h2 className="text-lg capitalize font-semibold">Smartphone test</h2>
                    <div className="flex flex-col gap-y-1">
                        {/* quantity controls */}
                        <div className="flex items-center gap-x-1">
                            <div className="w-[18px] h-[18px] flex justify-center items-center cursor-pointer text-white bg-conic-gradient rounded-full">
                                <BiMinus />
                            </div>
                            <div className="font-semibold flex flex-1 max-w-[30px] justify-center items-center text-sm">
                                1
                            </div>
                            <div className="w-[18px] h-[18px] flex justify-center items-center cursor-pointer text-white bg-conic-gradient rounded-full">
                                <BiPlus />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    {/* remove item */}
                    <div className="text-2xl flex justify-center items-center self-end cursor-pointer hover:scale-110 duration-100 transition-all text-orange">
                        <IoCloseOutline />
                    </div>
                    {/* price */}
                    <div>
                        <span className="">$99.99</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
