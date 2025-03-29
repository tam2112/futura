'use client';

import AnimatedBox from './AnimatedBox';
import { HTMLAttributes } from 'react';

export type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text';
    block?: boolean;
    bgBlack?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
    return <AnimatedBox {...props} animateOn="hover" as="button" />;
}
