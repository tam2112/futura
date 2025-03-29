'use client';

import AnimatedBox from './AnimatedBox';
import { HTMLAttributes } from 'react';

export type BoxProps = {
    variant?: 'primary' | 'secondary' | 'tertiary';
    block?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function Box(props: BoxProps) {
    return <AnimatedBox {...props} animateOn="hover" as="div" />;
}
