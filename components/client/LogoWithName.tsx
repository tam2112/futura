'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function LogoWithName() {
    return (
        <>
            <Link href="/">
                <div className="flex gap-4 items-center">
                    <Logo />
                    <div className="text-3xl font-extrabold">Futura.</div>
                </div>
            </Link>
        </>
    );
}
