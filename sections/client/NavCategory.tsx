'use client';

import Button from '@/components/Button';
import DarkModeSwitch from '@/components/DarkModeSwitch';
import { navCategoriesData } from '@/temp/categoryData';
import { HiBars3 } from 'react-icons/hi2';
import Fire from '@/components/Fire';
import LanguageSelect from '@/components/LanguageSelect';
import { useState } from 'react';
import CategoryModal from '@/components/modal/CategoryModal';

export default function NavCategory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <CategoryModal isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="container">
                <div className="py-2 flex justify-between items-center">
                    {/* category */}
                    <ul className="flex items-center gap-6">
                        <li className="">
                            <Button
                                variant="text"
                                className="font-normal relative after:left-0"
                                onClick={() => setIsOpen(true)}
                            >
                                <div className="flex items-center gap-2">
                                    <HiBars3 />
                                    <span>All Items</span>
                                </div>
                            </Button>
                        </li>
                        <li className="ml-6">
                            <Button variant="text" className="font-normal relative after:left-0">
                                <div className="flex items-center gap-2">
                                    <span>Deals</span>
                                    <Fire />
                                </div>
                            </Button>
                        </li>
                        {navCategoriesData.map(({ id, name }) => (
                            <li key={id}>
                                <Button variant="text" className="font-normal relative after:left-0">
                                    {name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                    {/* right nav */}
                    <div className="flex items-center gap-4">
                        {/* languages */}
                        <LanguageSelect />
                        {/* dark mode */}
                        <div className="border border-black/10 p-2 px-3 relative rounded-lg">
                            <DarkModeSwitch />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
