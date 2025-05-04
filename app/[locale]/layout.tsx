import type { Metadata } from 'next';
import { Sora, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from '@/context/CartContext';
import { StoreContextProvider } from '@/context/StoreContext';

const sora = Sora({
    subsets: ['latin'],
    variable: '--font-sora',
    weight: 'variable',
});
const spaceGroteskFont = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    weight: 'variable',
});

export const metadata: Metadata = {
    title: 'Futuristic E-commerce 🛍️',
    description: 'Graduation project is made by Robert',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <StoreContextProvider>
                <AuthProvider>
                    <CartProvider>
                        <html lang="en">
                            <body
                                className={`${sora.variable} ${spaceGroteskFont.variable} font-body antialiased scrollbar`}
                            >
                                {children}
                                <ToastContainer position="top-right" theme="light" />
                            </body>
                        </html>
                    </CartProvider>
                </AuthProvider>
            </StoreContextProvider>
        </NextIntlClientProvider>
    );
}
