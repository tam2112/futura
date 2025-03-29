'use client';

import AnimatedBox from './AnimatedBox';
import { HTMLAttributes } from 'react';

export type InputProps = {
    variant?: 'primary' | 'secondary' | 'tertiary';
    block?: boolean;
} & HTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
    return <AnimatedBox {...props} animateOn="focus" as="input" />;
}
