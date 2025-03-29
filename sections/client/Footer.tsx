import Button from '@/components/Button';
import { FaDiscord, FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-[#1f2324] relative overflow-x-clip py-8">
            <div className="container">
                <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-8">
                    <div className="font-extrabold text-2xl text-white">Futura.</div>
                    {/* <nav className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
                        {navItems.map(({ name, href }) => (
                            <Link
                                key={name}
                                href={href}
                                className="uppercase text-xs tracking-widest font-bold text-gray-400"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.querySelector(href);
                                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {name}
                            </Link>
                        ))}
                    </nav> */}
                </div>
                <div className="mt-12 flex flex-col md:flex-row-reverse md:justify-between items-center gap-8">
                    <div className="flex justify-center gap-6">
                        <Button className="!size-10 !rounded-full inline-flex items-center justify-center !p-0" bgBlack>
                            <FaYoutube className="text-red-600" size={20} />
                        </Button>
                        <Button className="!size-10 !rounded-full inline-flex items-center justify-center !p-0" bgBlack>
                            <FaTiktok className="text-pink-600" size={20} />
                        </Button>
                        <Button className="!size-10 !rounded-full inline-flex items-center justify-center !p-0" bgBlack>
                            <FaDiscord className="text-indigo-600" size={20} />
                        </Button>
                        <Button className="!size-10 !rounded-full inline-flex items-center justify-center !p-0" bgBlack>
                            <FaFacebookF className="text-sky-600" size={20} />
                        </Button>
                    </div>
                    <p className="text-gray-500 text-sm">&copy; Futura | All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
