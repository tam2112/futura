import Navigation from '@/sections/client/Navigation';
import NavCategory from './NavCategory';

export default function Header() {
    return (
        <header className="fixed bg-white top-0 left-0 right-0 z-[9999] shadow-md">
            <Navigation />
            <NavCategory />
        </header>
    );
}
