import Header from '@/sections/admin/Header';
import Sidebar from '@/sections/admin/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Panel',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-100 min-h-screen [&::-webkit-scrollbar]:w-0">
            <Sidebar />
            <Header />
            <div className="ml-[270px] pt-[15px] overflow-x-hidden">{children}</div>
        </div>
    );
}
