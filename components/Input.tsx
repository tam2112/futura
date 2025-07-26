'use client';

import AnimatedBox, { AnimatedBoxProps } from './AnimatedBox';

export type InputProps = Omit<AnimatedBoxProps<'div'>, 'animateOn' | 'as'>;

export default function Input(props: InputProps) {
    return <AnimatedBox {...props} animateOn="focus" as="input" />;
}
