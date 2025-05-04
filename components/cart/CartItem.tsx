'use client';

import Image from 'next/image';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';
import { useStore } from '@/context/StoreContext';

type CartItemProps = {
    productId: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
};

export default function CartItem({ productId, image, name, price, quantity }: CartItemProps) {
    const { increaseAmount, decreaseAmount, handleRemoveFromCart } = useStore();

    return (
        <div className="select-none pt-2">
            <div className="flex gap-x-4 mb-2">
                {/* image */}
                <div className="flex justify-center items-center">
                    <Image src={image} alt={name} width={90} height={90} className="object-contain" />
                </div>
                {/* product info */}
                <div className="flex-1 flex flex-col gap-y-1">
                    {/* name */}
                    <h2 className="">{name}</h2>
                    <div className="flex flex-col gap-y-1">
                        {/* quantity controls */}
                        <div className="flex items-center gap-x-1">
                            <div
                                className="w-[18px] h-[18px] flex justify-center items-center cursor-pointer text-white bg-conic-gradient rounded-full"
                                onClick={() => decreaseAmount(productId)}
                            >
                                <BiMinus />
                            </div>
                            <div className="font-semibold flex flex-1 max-w-[30px] justify-center items-center text-sm">
                                {quantity}
                            </div>
                            <div
                                className="w-[18px] h-[18px] flex justify-center items-center cursor-pointer text-white bg-conic-gradient rounded-full"
                                onClick={() => increaseAmount(productId)}
                            >
                                <BiPlus />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    {/* remove item */}
                    <div
                        className="text-2xl flex justify-center items-center self-end cursor-pointer hover:scale-110 duration-100 transition-all text-orange"
                        onClick={() => handleRemoveFromCart(productId)}
                    >
                        <IoCloseOutline />
                    </div>
                    {/* price */}
                    <div>
                        <span className="">${(price * quantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
