'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import GoToTop from '@/components/GoToTop';
import { useCallback, useEffect, useState } from 'react';
import { updateOrderStatus } from '@/lib/actions/order.action';
import { useOrderStore } from '@/store/orderStore';

export default function OrderList({ userId }: { userId: string | null }) {
    const { orders, fetchOrders } = useOrderStore();
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        // if (!userId) {
        //     toast.error('Please login to view orders');
        //     setLoading(false);
        //     return;
        // }

        if (!userId) {
            toast.error('Please login to view orders');
            setLoading(false);
            return;
        }
        try {
            await fetchOrders(userId);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [userId, fetchOrders]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        console.log('userId', userId);
        console.log('orders', orders);
    }, [userId, orders]);

    const handleCancelOrder = async (orderId: string) => {
        try {
            const result = await updateOrderStatus({ orderId, statusId: 'Cancelled' });
            if (result.success) {
                toast.success(result.message);
                fetchData();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to cancel order');
        } finally {
            setShowConfirm(null);
        }
    };

    if (loading) {
        return <div className="min-h-[40vh] mt-[100px] flex justify-center">Loading orders...</div>;
    }

    if (!orders.length) {
        return (
            <div className="min-h-[40vh] mt-[100px] flex flex-col items-center gap-4">
                <Image src="/empty-cart.png" alt="No orders" width={200} height={200} />
                <h2 className="text-2xl font-semibold">No Orders Found</h2>
                <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
            </div>
        );
    }

    return (
        <>
            <GoToTop />
            <div className="min-h-[70vh] mt-[160px] max-w-6xl mx-auto px-4 pb-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative"
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
                                        <h3 className="font-semibold text-lg">{order.product.name}</h3>
                                        <p className="text-gray-600">
                                            Quantity: {order.quantity} × ${order.product.price}
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
                                                : order.status.name.toLowerCase() === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status.name.toLowerCase() === 'out for delivery'
                                                ? 'bg-blue-100 text-blue-800'
                                                : order.status.name.toLowerCase() === 'cancelled'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {order.status.name.charAt(0).toUpperCase() + order.status.name.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-medium mb-2">Delivery Information</h4>
                                {order.deliveryInfo[0] && (
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            {order.deliveryInfo[0].firstName} {order.deliveryInfo[0].lastName}
                                        </p>
                                        <p>{order.deliveryInfo[0].street}</p>
                                        <p>
                                            {order.deliveryInfo[0].city}, {order.deliveryInfo[0].country}
                                        </p>
                                        <p>Phone: {order.deliveryInfo[0].phone}</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                Ordered on: {new Date(order.createdDate).toLocaleDateString()}
                            </div>
                            {order.status.name.toLowerCase() === 'pending' && (
                                <button
                                    onClick={() => setShowConfirm(order.id)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Cancel Order
                                </button>
                            )}
                            {showConfirm === order.id && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-lg">
                                        <p className="mb-4">Xác nhận muốn hủy order hay không?</p>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setShowConfirm(null)}
                                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                            >
                                                Back
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
