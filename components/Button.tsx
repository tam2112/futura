'use client';

import AnimatedBox, { AnimatedBoxProps } from './AnimatedBox';

export type ButtonProps = Omit<AnimatedBoxProps<'div'>, 'animateOn' | 'as'>;

export default function Button(props: ButtonProps) {
    return <AnimatedBox {...props} animateOn="hover" as="button" />;
}
