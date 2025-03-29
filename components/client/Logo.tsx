import logoImage from '@/public/futura-logo.svg?url';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Logo(props: HTMLAttributes<HTMLDivElement>) {
    const { className, style, ...otherProps } = props;

    return (
        <div
            className={twMerge(
                'size-10 bg-gray-200 bg-[conic-gradient(from_45deg,var(--color-violet-500),var(--color-fuchsia-500),var(--color-amber-400),var(--color-teal-400),var(--color-violet-500))]',
                className,
            )}
            style={{
                maskImage: `url(${logoImage.src})`,
                maskSize: 'contain',
                ...style,
            }}
            {...otherProps}
        ></div>
    );
}
