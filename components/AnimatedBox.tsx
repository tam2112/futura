'use client';

import { cva } from 'class-variance-authority';
import { HTMLAttributes, useEffect, useState } from 'react';
import { animate, motion, MotionProps, useMotionTemplate, useMotionValue } from 'framer-motion';

// Restrict `as` prop to HTML elements supported by Framer Motion
type MotionHTMLTags = keyof Pick<
    JSX.IntrinsicElements,
    | 'div'
    | 'button'
    | 'span'
    | 'a'
    | 'p'
    | 'li'
    | 'ul'
    | 'ol'
    | 'section'
    | 'article'
    | 'header'
    | 'footer'
    | 'nav'
    | 'input'
    | 'select'
    | 'textarea'
>;

export type AnimatedBoxProps<T extends MotionHTMLTags = 'div'> = {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text';
    block?: boolean;
    animateOn?: 'hover' | 'focus';
    as?: T;
    bgBlack?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, keyof MotionProps> &
    MotionProps;

const classes = cva('text-black py-2', {
    variants: {
        block: {
            true: 'w-full',
        },
        variant: {
            primary: 'border-gradient px-6 rounded-lg font-medium',
            secondary: 'bg-gray-100 text-white rounded-lg',
            tertiary: 'bg-gray-800 text-gray-200 rounded-lg',
            text: 'rounded-lg hover:font-medium h-auto border-transparent after:transition-all after:duration-500 after:content-[""] after:h-[2px] after:w-0 after:absolute after:top-[90%] after:bg-gradient hover:after:w-full',
        },
    },
    defaultVariants: {
        variant: 'primary',
        block: false,
    },
});

export default function AnimatedBox<T extends MotionHTMLTags = 'div'>({
    className = '',
    children,
    variant = 'primary',
    animateOn = 'hover',
    as = 'div' as T,
    bgBlack = false,
    ...motionProps
}: AnimatedBoxProps<T>) {
    const [isAnimated, setIsAnimated] = useState(false);
    const angle = useMotionValue(45);
    const background = useMotionTemplate`linear-gradient(${bgBlack ? 'var(--color-black)' : 'var(--color-white)'},${
        bgBlack ? 'var(--color-black)' : 'var(--color-white)'
    }) padding-box,conic-gradient(from ${angle}deg,var(--color-violet-500),var(--color-fuchsia-500),var(--color-amber-400),var(--color-teal-400),var(--color-violet-500)) border-box`;

    useEffect(() => {
        if (isAnimated) {
            animate(angle, angle.get() + 360, {
                duration: 2,
                ease: 'linear',
                repeat: Infinity,
            });
        } else {
            animate(angle, 45, { duration: 0.5 });
        }
    }, [isAnimated, angle]);

    const handleMouseEnter = () => {
        if (animateOn === 'hover') {
            setIsAnimated(true);
        }
    };

    const handleMouseLeave = () => {
        if (animateOn === 'hover') {
            setIsAnimated(false);
        }
    };

    const handleFocus = () => {
        if (animateOn === 'focus') {
            setIsAnimated(true);
        }
    };

    const handleBlur = () => {
        if (animateOn === 'focus') {
            setIsAnimated(false);
        }
    };

    // Dynamically select the motion component based on the `as` prop
    const MotionComponent = (motion[as] ?? motion.div) as React.ElementType;

    return (
        <MotionComponent
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={classes({ variant, block: motionProps.block, className })}
            style={variant === 'primary' ? { background } : undefined}
            tabIndex={animateOn === 'focus' ? 0 : -1}
            {...motionProps}
        >
            {children}
        </MotionComponent>
    );
}
