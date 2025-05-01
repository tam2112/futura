import { getCategories, getRandomCategories } from '@/lib/actions/category.action';
import { create } from 'zustand';

type Category = {
    id: string;
    name: string;
    slug: string;
    images: {
        url: string;
    }[];
};

type CategoryStore = {
    randomCategories: Category[];
    trendingCategories: Category[];
    popularCategories: Category[];
    categories: Category[];
    fetchRandomCategories: () => Promise<void>;
    fetchTrendingCategories: () => Promise<void>;
    fetchPopularCategories: () => Promise<void>;
    fetchCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    randomCategories: [],
    fetchRandomCategories: async () => {
        try {
            const data = await getRandomCategories(5);
            set({ randomCategories: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    trendingCategories: [],
    fetchTrendingCategories: async () => {
        try {
            const data = await getRandomCategories(4);
            set({ trendingCategories: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    popularCategories: [],
    fetchPopularCategories: async () => {
        try {
            const data = await getRandomCategories(9);
            set({ popularCategories: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    categories: [],
    fetchCategories: async () => {
        try {
            const data = await getCategories();
            set({ categories: data });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },
}));
