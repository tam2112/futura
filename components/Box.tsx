import AnimatedBox, { AnimatedBoxProps } from './AnimatedBox';

export type BoxProps = Omit<AnimatedBoxProps<'div'>, 'animateOn' | 'as'>;

export default function Box(props: BoxProps) {
    return <AnimatedBox {...props} animateOn="hover" as="div" />;
}
