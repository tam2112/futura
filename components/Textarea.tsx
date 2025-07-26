'use client';

import AnimatedBox, { AnimatedBoxProps } from './AnimatedBox';

export type TextareaProps = Omit<AnimatedBoxProps<'div'>, 'animateOn' | 'as'>;

export default function Textarea(props: TextareaProps) {
    return <AnimatedBox {...props} animateOn="focus" as="textarea" />;
}
