import Footer from '@/sections/client/Footer';
import Header from '@/sections/client/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            <div>{children}</div>
            <Footer />
        </div>
    );
}
