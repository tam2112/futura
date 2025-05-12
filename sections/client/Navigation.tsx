/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { CiSearch } from 'react-icons/ci';
import LogoWithName from '../../components/client/LogoWithName';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import Box from '../../components/Box';
import Image from 'next/image';
import { GoChevronDown } from 'react-icons/go';
import Button from '../../components/Button';
import { PiHeart, PiShoppingBagOpenLight, PiUser } from 'react-icons/pi';
import avatarImage from '@/public/default-avatar.png';
import { Link, useRouter } from '@/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import CartModal from '@/components/modal/CartModal';
import Cookies from 'js-cookie';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { getProducts } from '@/lib/actions/product.action';
import { debounce } from 'lodash';
import Loader from '@/components/Loader';
import { useTranslations } from 'next-intl';

export default function Navigation() {
    const { isLoggedIn, logout } = useAuth();
    const { updateCartAmount } = useCart();
    const { itemAmount } = useStore();
    const fullName = Cookies.get('fullName') || 'Robert';
    const router = useRouter();
    const [isOpenCart, setIsOpenCart] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('Navigation');

    useEffect(() => {
        updateCartAmount();
    }, [isLoggedIn, updateCartAmount]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSuggestionsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (query.trim() === '') {
            setSuggestions([]);
            setIsSuggestionsOpen(false);
            return;
        }

        try {
            const products = await getProducts();
            const filteredProducts = (products ?? [])
                .filter((product: any) => product.name.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filteredProducts);
            setIsSuggestionsOpen(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setIsSuggestionsOpen(false);
        }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedFetchSuggestions(query);
    };

    const handleSuggestionClick = (slug: string) => {
        setSearchQuery('');
        setSuggestions([]);
        setIsSuggestionsOpen(false);
        setIsLoading(true); // Show loader
        setTimeout(() => {
            setIsLoading(false); // Hide loader
            router.push(`/collections/details/${slug}`);
        }, 500); // 0.5-second delay
    };

    const handleLogout = () => {
        logout();
        updateCartAmount();
        router.push('/');
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
                    <Loader />
                </div>
            )}
            <CartModal isOpenCart={isOpenCart} setIsOpenCart={setIsOpenCart} />
            <div className="border-b border-black/5">
                <div className="container">
                    <div className="h-20 flex justify-between items-center">
                        {/* left nav */}
                        <Link href="/">
                            <LogoWithName />
                        </Link>
                        {/* middle nav */}
                        <div className="w-[500px]" ref={searchContainerRef}>
                            <div className="ml-12 relative">
                                <div className="border border-black/60 rounded-full relative">
                                    <CiSearch size={20} className="absolute top-1/2 -translate-y-1/2 ml-3" />
                                    <input
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        className="w-full outline-none rounded-full px-4 pl-10 py-2 bg-transparent"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchQuery && setIsSuggestionsOpen(true)}
                                    />
                                </div>
                                {isSuggestionsOpen && suggestions.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                                        <ul className="flex flex-col">
                                            {suggestions.map((product) => (
                                                <li
                                                    key={product.id}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSuggestionClick(product.slug)}
                                                >
                                                    <Image
                                                        src={
                                                            product.images.length > 0
                                                                ? product.images[0].url
                                                                : '/device-test-02.png'
                                                        }
                                                        alt={product.name}
                                                        width={40}
                                                        height={40}
                                                        className="size-10 object-cover"
                                                    />
                                                    <span className="text-sm">{product.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* right nav */}
                        <div className="flex items-center gap-4">
                            {/* account */}
                            <div className="flex items-center gap-4">
                                {/* have an account */}
                                {isLoggedIn ? (
                                    <>
                                        <div
                                            onClick={() => setIsOpenCart(true)}
                                            className="p-2 text-center border border-black/10 rounded-full relative cursor-pointer"
                                        >
                                            {itemAmount > 0 && (
                                                <div className="absolute right-0 -top-0 size-4 rounded-full bg-gradient flex items-center justify-center text-xs text-white/85 font-extrabold">
                                                    {itemAmount}
                                                </div>
                                            )}
                                            <HiOutlineShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <Box className="py-1 px-[34px] text-center group relative">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <Image src={avatarImage} alt="" className="size-8" />
                                                    </div>
                                                    <span className="inline-flex gap-1 capitalize items-center">
                                                        {fullName} <GoChevronDown size={20} />
                                                    </span>
                                                </div>
                                                <div className="absolute z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 left-0 top-[49px] w-full shadow-sm">
                                                    <div className="w-full bg-white border border-gray-300 rounded-lg">
                                                        <ul className="flex flex-col items-start font-normal px-3 py-2">
                                                            <li>
                                                                <Link href="/favourite">
                                                                    <Button
                                                                        variant="text"
                                                                        className="inline-flex items-center gap-2 font-normal relative"
                                                                    >
                                                                        <PiHeart size={20} />
                                                                        <span>{t('favourite')}</span>
                                                                    </Button>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/my-profile">
                                                                    <Button
                                                                        variant="text"
                                                                        className="inline-flex items-center gap-2 font-normal relative"
                                                                    >
                                                                        <PiUser size={20} />
                                                                        <span>{t('profile')}</span>
                                                                    </Button>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/my-orders">
                                                                    <Button
                                                                        variant="text"
                                                                        className="inline-flex items-center gap-2 font-normal relative"
                                                                    >
                                                                        <PiShoppingBagOpenLight size={20} />
                                                                        <span>{t('myOrders')}</span>
                                                                    </Button>
                                                                </Link>
                                                            </li>
                                                            <li className="inline-flex justify-center w-full">
                                                                <Button
                                                                    className="w-full font-medium mt-2"
                                                                    onClick={handleLogout}
                                                                >
                                                                    {t('signOut')}
                                                                </Button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </Box>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/sign-in" className="relative">
                                            <Button variant="text" className="after:left-0">
                                                {t('logIn')}
                                            </Button>
                                        </Link>
                                        <Link href="/sign-up">
                                            <Button>{t('signUp')}</Button>
                                        </Link>
                                    </>
                                )}
                                {/* no account */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
