import FeatureHighlightSlider from '@/components/slider/FeatureHighlightSlider';

export default function FeatureHighlights() {
    return (
        <div className="bg-light-gray py-8 md:py-10">
            <div className="container">
                <div className="px-0 xl:px-20">
                    <div>
                        <FeatureHighlightSlider />
                    </div>
                </div>
            </div>
        </div>
    );
}
