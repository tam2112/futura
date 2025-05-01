import GoToTop from '@/components/GoToTop';
import FeatureHighlights from '@/sections/client/FeatureHighlights';
import Hero from '@/sections/client/Hero';
import OfficialStores from '@/sections/client/OfficialStores';
import PopularCategories from '@/sections/client/PopularCategories';
import PopularDevices from '@/sections/client/PopularDevices';
import Sponsor from '@/sections/client/Sponsor';
import TopDeals from '@/sections/client/TopDeals';

export default function Home() {
    return (
        <>
            <GoToTop />
            <Hero />
            <PopularCategories />
            <PopularDevices />
            <TopDeals />
            <OfficialStores />
            <Sponsor />
            <FeatureHighlights />
        </>
    );
}
