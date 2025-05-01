import Image from 'next/image';

import checkOutlineImg from '@/public/official-store/check-outline.svg?url';
import { Link } from '@/navigation';

interface DevicesBrandProps {
    data: {
        id: string;
        title: string;
        price: number;
        img: string;
        href: string;
    }[];
}

export default function DevicesBrand({ data }: DevicesBrandProps) {
    return (
        <div className="hidden lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-2">
            {data.map(({ id, title, price, img, href }) => (
                <Link href={href} key={id}>
                    <div className="relative flex h-full w-full flex-col justify-start rounded-md border border-gray-200 bg-white px-3 py-2 lg:py-0">
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 rounded-md bg-[#F5FFFF] px-1 py-1.5 text-xs text-[#497B7D]">
                                <div className="h-3.5 w-3.5">
                                    <Image src={checkOutlineImg} alt="" width={15} height={15} className="size-full" />
                                </div>
                                Direct from brand
                            </div>
                        </div>
                        <div className="flex h-full w-full flex-col p-3">
                            <div className="mt-2 flex items-center justify-center">
                                <div className="h-24 w-24">
                                    <Image
                                        src={img}
                                        alt={title}
                                        width={100}
                                        height={100}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex flex-1 flex-col justify-between text-left text-sm">
                                <div>
                                    <h2 className="two-line-ellipsis text-sm">{title}</h2>
                                </div>
                                <div className="mt-2 flex items-center justify-between lg:mb-1">
                                    <div className="text-sm font-extrabold">${price.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
