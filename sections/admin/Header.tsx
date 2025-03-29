import Image from 'next/image';
import { CiBellOn, CiSearch } from 'react-icons/ci';

export default function Header() {
    return (
        <div className="ml-[270px] pt-[15px] mr-[30px] pb-[15px] flex justify-between items-center">
            {/* search input */}
            <div className="relative border border-slate-400 rounded-full max-w-[240px]">
                <CiSearch className="absolute top-1/2 -translate-y-1/2 left-1" />
                <input type="text" placeholder="Search..." className="bg-transparent outline-none pl-7 py-1 text-sm" />
            </div>
            {/* interactive */}
            <div className="flex items-center gap-5">
                <div className="relative bg-white p-1.5 rounded-full">
                    <CiBellOn size={20} />
                    <div className="absolute -top-3 -right-3 bg-conic-gradient px-2 py-1 text-white font-semibold rounded-full text-[8px]">
                        1
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-semibold">Robert</h4>
                    <p className="text-[10px] text-right text-gray-400 leading-none">Admin</p>
                </div>
                <div>
                    <Image src="/default-avatar.png" alt="" width={24} height={24} className="rounded-full" />
                </div>
            </div>
        </div>
    );
}
