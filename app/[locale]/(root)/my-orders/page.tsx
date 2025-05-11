'use client';

import { getUserIdFromCookie } from '@/lib/auth';
import { getUserOrders, updateOrderStatusByName } from '@/lib/actions/order.action';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import GoToTop from '@/components/GoToTop';
import Loader from '@/components/Loader';
import { useLocale, useTranslations } from 'next-intl';

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
    const locale = useLocale() as 'en' | 'vi';

    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);

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

    return (
        <>
            <GoToTop />
            <div className="min-h-[70vh] mt-[160px] max-w-6xl mx-auto px-4 pb-8">
                <h1 className="text-3xl font-bold mb-8">{t('myOrders')}</h1>
                <div className="space-y-6">
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
                                        <h3 className="font-semibold text-lg max-w-[600px]">{order.product.name}</h3>
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
        </>
    );
}
