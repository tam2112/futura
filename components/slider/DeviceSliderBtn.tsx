'use client';

import { useEffect, useState } from 'react';
import Button from '../Button';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { Swiper as SwiperType } from 'swiper';
import { twMerge } from 'tailwind-merge';

interface DeviceSliderBtnProps {
    swiperRef: React.MutableRefObject<SwiperType | null>;
}

export default function DeviceSliderBtn({ swiperRef }: DeviceSliderBtnProps) {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (swiper) {
            swiper.slideTo(0);

            // Cập nhật trạng thái ban đầu
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            // Theo dõi sự kiện slide change để cập nhật trạng thái
            swiper.on('slideChange', () => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
            });
        }
    }, [swiperRef]);

    return (
        <>
            <div className="-left-6 lg:absolute top-1/2 -translate-y-1/2 z-[11]">
                <Button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className={twMerge('!rounded-full py-4 px-3', isBeginning ? 'invisible' : 'visible')}
                >
                    <GrPrevious size={20} />
                </Button>
            </div>
            <div className="-right-6 lg:absolute top-1/2 -translate-y-1/2 z-[11]">
                <Button
                    onClick={() => swiperRef.current?.slideNext()}
                    className={twMerge('!rounded-full py-4 px-3', isEnd ? 'invisible' : 'visible')}
                >
                    <GrNext size={20} />
                </Button>
            </div>
        </>
    );
}
