'use client';

import { stagger, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import SplitType from 'split-type';

const useTextRevealAnimation = () => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        new SplitType(scope.current, {
            types: 'lines,words',
            tagName: 'span',
        });
    }, [scope]);

    const entranceAnimation = () => {
        return animate(
            scope.current.querySelectorAll('.word'),
            {
                transform: 'translateY(0)',
            },
            {
                duration: 0.5,
                delay: stagger(0.15),
            },
        );
    };

    const exitAnimation = () => {
        return animate(
            scope.current.querySelectorAll('.word'),
            {
                transform: 'translateY(100%)',
            },
            {
                duration: 0.3,
                delay: stagger(-0.025, {
                    startDelay: scope.current.querySelectorAll('.word').length * 0.025,
                }),
            },
        );
    };

    return {
        scope,
        entranceAnimation,
        exitAnimation,
    };
};

export default useTextRevealAnimation;
