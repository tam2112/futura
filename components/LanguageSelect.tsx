'use client';

import { CiGlobe } from 'react-icons/ci';
import Connect from './Connect';
import Image from 'next/image';
import vietnamFlag from '@/public/vietnam.png';
import englishFlag from '@/public/united-kingdom.png';
import { useRouter } from '@/navigation';
import Button from './Button';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageSelect() {
    const t = useTranslations('LanguageSelect');

    const router = useRouter();
    const currentLocale = useLocale();

    const handleChangeLocale = (locale: string) => {
        router.push('/', { locale });
    };

    return (
        <div className="border border-black/10 p-2 px-6 relative rounded-lg group">
            <div className="text-center flex items-center">
                <CiGlobe size={20} />
                <Connect />
                <span>
                    <Image
                        src={currentLocale === 'vi' ? vietnamFlag : englishFlag}
                        alt={`${currentLocale} flag`}
                        className="size-6"
                    />
                </span>
            </div>
            <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 left-0 top-[40px] w-full shadow-sm">
                <div className="w-full bg-white border border-black/10 rounded-lg">
                    <div className="flex flex-col items-start font-normal px-4 py-2">
                        <div>
                            <Button
                                variant="text"
                                className="inline-flex items-center gap-2 font-normal relative"
                                onClick={() => handleChangeLocale('vi')}
                            >
                                <Image src={vietnamFlag} alt="vietnam flag" className="size-6" />
                                <span className="">{t('vietnam')}</span>
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="text"
                                className="inline-flex items-center gap-2 font-normal relative"
                                onClick={() => handleChangeLocale('en')}
                            >
                                <Image src={englishFlag} alt="english flag" className="size-6" />
                                <span className="">{t('english')}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
