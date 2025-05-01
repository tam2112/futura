'use client';

import { GoChevronUp } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { animateScroll as scroll } from 'react-scroll';

export default function GoToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 50) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Cuộn lên đầu trang
    const scrollToTop = () => {
        scroll.scrollToTop({
            duration: 500,
            smooth: true,
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            <motion.button
                onClick={scrollToTop}
                className="size-11 flex items-center justify-center rounded-full bg-gradient-light shadow-lg hover:opacity-90 transition-opacity duration-300"
                aria-label="Go to top"
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
            >
                <GoChevronUp size={28} className="text-black" />
            </motion.button>
        </div>
    );
}
