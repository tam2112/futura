'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import ModelViewer from './ModelViewer';
import SliderBtns from '../slider/SliderBtns';

interface Model {
    id: number;
    url: string;
    title: string;
}

const models: Model[] = [
    { id: 1, url: '/models/smartphone.glb', title: 'Smartphone' },
    { id: 2, url: '/models/laptop.glb', title: 'Laptop' },
    { id: 3, url: '/models/headphone.glb', title: 'Headphone' },
    { id: 4, url: '/models/smartwatch.glb', title: 'Smartwatch' },
];

export default function ModelSlider() {
    return (
        <div className="max-w-[700px]">
            <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                allowTouchMove={false}
                loop
            >
                {models.map((model) => (
                    <SwiperSlide key={model.id}>
                        <div style={{ height: '710px', width: '100%' }}>
                            <ModelViewer modelUrl={model.url} />
                        </div>
                    </SwiperSlide>
                ))}
                <SliderBtns />
            </Swiper>
        </div>
    );
}
