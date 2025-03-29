import { popularCategoriesData } from '@/temp/categoryData';
import Image from 'next/image';

export default function PopularCategories() {
    return (
        <div className="py-8 pb-16">
            <div className="container">
                <h2 className="text-xl font-heading font-bold">Popular Categories</h2>
                <div>
                    <div className="mt-6 gap-x-5 gap-y-8 md:grid md:grid-cols-5 lg:grid-cols-7">
                        {popularCategoriesData.map(({ id, name, img }) => (
                            <div key={id} className="flex flex-col items-center group cursor-pointer">
                                <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-light lg:size-24 xl:size-28">
                                    <div className="absolute top-0 size-full">
                                        <Image
                                            src={img}
                                            alt={name}
                                            width={300}
                                            height={300}
                                            className="absolute top-1/2 -translate-y-1/2 scale-110 object-right object-contain group-hover:scale-125 transition-all duration-500"
                                        />
                                    </div>
                                </div>
                                <h3 className="mt-3 w-full truncate text-center text-sm">{name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
