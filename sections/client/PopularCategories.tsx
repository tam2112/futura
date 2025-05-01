'use client';

import { Link } from '@/navigation';
import { useCategoryStore } from '@/store/categoryStore';
import Image from 'next/image';
import { useEffect } from 'react';

export default function PopularCategories() {
    const { popularCategories, fetchPopularCategories } = useCategoryStore();

    useEffect(() => {
        // Gọi fetchCategories khi component mount
        fetchPopularCategories();
    }, [fetchPopularCategories]);

    return (
        <div className="py-8 pb-16">
            <div className="container">
                <h2 className="text-xl font-heading font-bold">Popular Categories</h2>
                <div>
                    <div className="mt-6 gap-x-5 gap-y-8 md:grid md:grid-cols-5 lg:grid-cols-7">
                        {popularCategories.map((cat) => (
                            <Link href={`/collections/list/${cat.slug}`} key={cat.id}>
                                <div className="flex flex-col items-center group cursor-pointer">
                                    <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-light lg:size-24 xl:size-28">
                                        <div className="absolute top-0 size-full">
                                            <Image
                                                src={cat.images[0].url}
                                                alt={cat.name}
                                                width={300}
                                                height={300}
                                                className="absolute top-1/2 -translate-y-1/2 scale-110 object-right object-contain group-hover:scale-125 transition-all duration-500"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="mt-3 w-full truncate text-center text-sm capitalize">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
