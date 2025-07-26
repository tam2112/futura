'use client';

import AnimatedBox, { AnimatedBoxProps } from './AnimatedBox';

export type SelectProps = Omit<AnimatedBoxProps<'div'>, 'animateOn' | 'as'>;

export default function Select(props: SelectProps) {
    return <AnimatedBox {...props} animateOn="focus" as="select" />;
}
