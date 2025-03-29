'use client';

import AnimatedBox from './AnimatedBox';
import { HTMLAttributes } from 'react';

export type TextareaProps = {
    variant?: 'primary' | 'secondary' | 'tertiary';
    block?: boolean;
} & HTMLAttributes<HTMLTextAreaElement>;

export default function Textarea(props: TextareaProps) {
    return <AnimatedBox {...props} animateOn="focus" as="textarea" />;
}
