'use client';

import AnimatedBox from './AnimatedBox';
import { HTMLAttributes } from 'react';

export type SelectProps = {
    variant?: 'primary' | 'secondary' | 'tertiary';
    block?: boolean;
} & HTMLAttributes<HTMLSelectElement>;

export default function Select(props: SelectProps) {
    return <AnimatedBox {...props} animateOn="focus" as="select" />;
}
