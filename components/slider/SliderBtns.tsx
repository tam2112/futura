import { useSwiper } from 'swiper/react';
import Button from '../Button';
import { GrNext, GrPrevious } from 'react-icons/gr';

export default function SliderBtns() {
    const swiper = useSwiper();

    return (
        <div className="relative z-10 -top-8">
            <div className="flex justify-end items-center gap-6">
                <Button onClick={() => swiper.slidePrev()} className="!rounded-full py-4 px-3">
                    <GrPrevious size={20} />
                </Button>
                <Button onClick={() => swiper.slideNext()} className="!rounded-full py-4 px-3">
                    <GrNext size={20} />
                </Button>
            </div>
        </div>
    );
}
