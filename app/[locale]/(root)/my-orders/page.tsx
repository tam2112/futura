'use client';

import { getUserIdFromCookie } from '@/lib/auth';
import { getUserOrders, updateOrderStatusByName } from '@/lib/actions/order.action';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import GoToTop from '@/components/GoToTop';
import Loader from '@/components/Loader';
import { useLocale, useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { Link, usePathname, useRouter } from '@/navigation';
import Button from '@/components/Button';
import { PiHeart, PiShoppingBagOpenLight, PiSignOut, PiUser } from 'react-icons/pi';
import { twMerge } from 'tailwind-merge';
import avatarImage from '@/public/default-avatar.png';
import { useAuth } from '@/context/AuthContext';

type OrderWithDetails = {
    id: string;
    createdDate: Date;
    quantity: number;
    status: {
        name: string;
    };
    product: {
        name: string;
        price: number;
        images: { url: string }[];
    };
    deliveryInfo: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        country: string;
        phone: string;
    }[];
};

export default function MyOrderPage() {
    const t = useTranslations('MyOrders');
    const a = useTranslations('AccountManagement');
    const locale = useLocale() as 'en' | 'vi';

    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);

    const fullName = Cookies.get('fullName') || 'Robert';
    const email = Cookies.get('email') || 'abc@gmail.com';

    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();

    const fetchOrders = useCallback(async () => {
        const userId = getUserIdFromCookie();
        if (!userId) {
            toast.error(t('loginToView'));
            setLoading(false);
            return;
        }

        try {
            const userOrders = await getUserOrders(userId);
            // Log data for debugging
            console.log('Fetched orders:', userOrders);
            // Ensure images is always an array
            const sanitizedOrders = userOrders.map((order) => ({
                ...order,
                product: {
                    ...order.product,
                    images: Array.isArray(order.product.images) ? order.product.images : [],
                },
            }));
            setOrders(sanitizedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(t('loadOrdersFailed'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="min-h-[40vh] mt-[100px] flex flex-col items-center gap-4">
                <Image src="/empty-cart.png" alt="No orders" width={200} height={200} />
                <h2 className="text-2xl font-semibold">{t('noOrderFound')}</h2>
                <p className="text-gray-600">{t('NoOrderDisplay')}</p>
            </div>
        );
    }

    const handleCancelOrder = async (orderId: string) => {
        try {
            const result = await updateOrderStatusByName(orderId, 'Cancelled', locale);
            if (result.success) {
                toast(t('cancelOrderSuccess'));
                fetchOrders();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(t('cancelOrderFailed'));
        } finally {
            setShowConfirm(null);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <>
            <GoToTop />
            <div className="min-h-[70vh] mt-[180px] px-16 pb-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* menu */}
                    <div
                        className="col-span-1 bg-white min-h-[500px] border-slate-200 border rounded-lg max-h-[70vh] sticky top-[180px] left-0"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 15px 20px -10px' }}
                    >
                        <div className="flex flex-col justify-between h-full p-6">
                            {/* item */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold font-heading">{a('title')}</h2>
                                <div className="space-y-2">
                                    <div className="relative w-max">
                                        <Link href="/favourite">
                                            <Button
                                                variant="text"
                                                className={twMerge(
                                                    'flex items-center gap-2',
                                                    pathname === '/favourite' &&
                                                        'rounded-lg font-medium h-auto border-transparent after:transition-all after:duration-500 after:content-[""] after:h-[2px] after:absolute after:top-[90%] after:bg-gradient after:w-full',
                                                )}
                                            >
                                                <PiHeart />
                                                <p>{a('favourite')}</p>
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="relative w-max">
                                        <Link href="/my-orders">
                                            <Button
                                                variant="text"
                                                className={twMerge(
                                                    'flex items-center gap-2',
                                                    pathname === '/my-orders' &&
                                                        'rounded-lg font-medium h-auto border-transparent after:transition-all after:duration-500 after:content-[""] after:h-[2px] after:absolute after:top-[90%] after:bg-gradient after:w-full',
                                                )}
                                            >
                                                <PiShoppingBagOpenLight />
                                                <p>{a('myOrders')}</p>
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="relative w-max">
                                        <Link href="/my-profile">
                                            <Button
                                                variant="text"
                                                className={twMerge(
                                                    'flex items-center gap-2',
                                                    pathname === '/my-profile' &&
                                                        'rounded-lg font-medium h-auto border-transparent after:transition-all after:duration-500 after:content-[""] after:h-[2px] after:absolute after:top-[90%] after:bg-gradient after:w-full',
                                                )}
                                            >
                                                <PiUser />
                                                <p>{a('myProfile')}</p>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* account */}
                            <div className="space-y-4">
                                <div className="border border-black rounded-full size-[68px] flex items-center justify-center">
                                    <Image src={avatarImage} alt="" className="size-16" />
                                </div>
                                <div>
                                    <p>{fullName}</p>
                                    <p className="font-light text-sm">{email}</p>
                                </div>
                                <div className="relative w-max">
                                    <Button variant="text" className="flex items-center gap-2" onClick={handleLogout}>
                                        <PiSignOut />
                                        <p>{a('signOut')}</p>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* content */}
                    <div className="col-span-2">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold font-heading">{t('myOrders')}</h2>
                            <p className="text-sm font-light">{t('description')}</p>
                        </div>
                        <div className="space-y-6 mt-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={order.product.images[0]?.url || '/device-test-02.png'}
                                                alt={order.product.name}
                                                width={80}
                                                height={80}
                                                className="rounded-md"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/device-test-02.png';
                                                }}
                                            />
                                            <div>
                                                <h3 className="font-semibold text-lg max-w-[600px]">
                                                    {order.product.name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {t('quantity')}: {order.quantity} × ${order.product.price}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl">
                                                ${(order.quantity * order.product.price).toFixed(2)}
                                            </p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm ${
                                                    order.status.name.toLowerCase() === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : order.status.name.toLowerCase() === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status.name.toLowerCase() === 'out for delivery'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}
                                            >
                                                {t(`${order.status.name}`)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="font-medium mb-2">{t('deliveryInformation')}</h4>
                                        {order.deliveryInfo[0] && (
                                            <div className="text-sm text-gray-600">
                                                <p>
                                                    {order.deliveryInfo[0].firstName} {order.deliveryInfo[0].lastName}
                                                </p>
                                                <p>{order.deliveryInfo[0].street}</p>
                                                <p>
                                                    {order.deliveryInfo[0].city}, {order.deliveryInfo[0].country}
                                                </p>
                                                <p>
                                                    {t('phone')}: {order.deliveryInfo[0].phone}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">
                                        {t('orderedOn')}: {new Date(order.createdDate).toLocaleDateString()}
                                    </div>
                                    {order.status.name.toLowerCase() === 'pending' && (
                                        <button
                                            onClick={() => setShowConfirm(order.id)}
                                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            {t('cancelOrder')}
                                        </button>
                                    )}
                                    {showConfirm === order.id && (
                                        <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                            <div className="bg-white p-6 rounded-lg">
                                                <p className="mb-4 font-semibold">{t('cancelOrderConfirm')}</p>
                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                    >
                                                        {t('confirm')}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowConfirm(null)}
                                                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                                    >
                                                        {t('back')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
