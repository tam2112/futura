import ProductList from '@/sections/collections/ProductList';
import { getDealProducts } from '@/lib/actions/product.action';

export default async function TopDealsPage() {
    const products = await getDealProducts();

    return (
        <div className="pt-8 pb-16 mt-[140px]">
            <ProductList initialProducts={products} showCategoriesFilter />
        </div>
    );
}
