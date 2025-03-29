'use client';

import { sponsors } from '@/temp/sponsorData';
import Image from 'next/image';

import { motion } from 'framer-motion';

export default function Sponsor() {
    return (
        <div className="bg-white py-8 sm:py-10 md:py-12 lg:py-14">
            <div className="container">
                <div className="flex overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: '-50%' }}
                        transition={{
                            repeat: Infinity,
                            ease: 'linear',
                            duration: 20,
                        }}
                        className="flex flex-none gap-18 md:gap-36 px-9 md:px-18"
                    >
                        {[...sponsors, ...sponsors].map(({ id, img }, index) => (
                            <div key={index}>
                                <Image
                                    src={img}
                                    alt="img"
                                    sizes="100vw"
                                    className="h-full w-full object-contain"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        inset: '0px',
                                        color: 'transparent',
                                    }}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
