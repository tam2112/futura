import ProductList from '@/sections/collections/ProductList';
import { getProductsByCategorySlug } from '@/lib/actions/product.action';

export default async function CollectionsListPage({ params }: { params: { slug: string } }) {
    const products = await getProductsByCategorySlug(params.slug);

    return (
        <div className="pt-8 pb-16 mt-[140px]">
            <ProductList initialProducts={products} />
        </div>
    );
}
