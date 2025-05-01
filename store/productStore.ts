import { create } from 'zustand';
import {
    getNewArrivals,
    getPopularIPhones,
    getPopularLaptops,
    getTrendingIPads,
    getDealProducts,
    getRandomProductsByBrand,
} from '@/lib/actions/product.action';

type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    priceWithDiscount?: number | null;
    images: { url: string }[];
    category: { name: string; slug: string; id: string };
    brand?: { name: string; id: string };
    promotions?: { percentageNumber: number }[];
};

type ProductStore = {
    newArrivals: Product[];
    popularIPhones: Product[];
    popularLaptops: Product[];
    trendingIPads: Product[];
    dealProducts: Product[];
    sonyProducts: Product[];
    acerProducts: Product[];
    lenovoProducts: Product[];
    dellProducts: Product[];
    fetchNewArrivals: () => Promise<void>;
    fetchPopularIPhones: () => Promise<void>;
    fetchPopularLaptops: () => Promise<void>;
    fetchTrendingIPads: () => Promise<void>;
    fetchDealProducts: (limit?: number) => Promise<void>;
    fetchSonyProducts: () => Promise<void>;
    fetchAcerProducts: () => Promise<void>;
    fetchLenovoProducts: () => Promise<void>;
    fetchDellProducts: () => Promise<void>;
};

export const useProductStore = create<ProductStore>((set) => ({
    newArrivals: [],
    fetchNewArrivals: async () => {
        try {
            const data = await getNewArrivals(10);
            set({ newArrivals: data });
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
        }
    },
    popularIPhones: [],
    fetchPopularIPhones: async () => {
        try {
            const data = await getPopularIPhones(8);
            set({ popularIPhones: data });
        } catch (error) {
            console.error('Error fetching popular iPhones:', error);
        }
    },
    popularLaptops: [],
    fetchPopularLaptops: async () => {
        try {
            const data = await getPopularLaptops(8);
            set({ popularLaptops: data });
        } catch (error) {
            console.error('Error fetching popular laptops:', error);
        }
    },
    trendingIPads: [],
    fetchTrendingIPads: async () => {
        try {
            const data = await getTrendingIPads(8);
            set({ trendingIPads: data });
        } catch (error) {
            console.error('Error fetching trending iPads:', error);
        }
    },
    dealProducts: [],
    fetchDealProducts: async (limit?: number) => {
        try {
            const data = await getDealProducts(limit);
            set({ dealProducts: data });
        } catch (error) {
            console.error('Error fetching deal products:', error);
        }
    },
    sonyProducts: [],
    fetchSonyProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Sony', 4);
            set({ sonyProducts: data });
        } catch (error) {
            console.error('Error fetching Sony products:', error);
        }
    },
    acerProducts: [],
    fetchAcerProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Acer', 4);
            set({ acerProducts: data });
        } catch (error) {
            console.error('Error fetching Acer products:', error);
        }
    },
    lenovoProducts: [],
    fetchLenovoProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Lenovo', 4);
            set({ lenovoProducts: data });
        } catch (error) {
            console.error('Error fetching Lenovo products:', error);
        }
    },
    dellProducts: [],
    fetchDellProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Dell', 4);
            set({ dellProducts: data });
        } catch (error) {
            console.error('Error fetching Dell products:', error);
        }
    },
}));
