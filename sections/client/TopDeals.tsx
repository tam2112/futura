import Image from 'next/image';
import sparksImg from '@/public/top-deals/sparks.png';
import smartphoneImg from '@/public/top-deals/smartphone.png';
import mixerImg from '@/public/top-deals/mixer.png';
import controllerImg from '@/public/top-deals/controller.png';
import smartwatchImg from '@/public/top-deals/smartwatch.png';
import saveUpImg from '@/public/top-deals/save-up.svg?url';
import dealAddedDailyImg from '@/public/top-deals/deal-added-daily.svg?url';
import TopDealsSlider from '@/components/slider/TopDealsSlider';
import underlineImage from '@/public/underline.svg?url';
import { Link } from '@/navigation';

export default function TopDeals() {
    return (
        <div className="py-6">
            <div className="container">
                <h2 className="flex items-center gap-1 text-lg font-bold md:text-xl">
                    Today&apos;s{' '}
                    <span className="relative">
                        <span>Top Deals</span>
                        <span
                            className="absolute w-full left-0 top-full -translate-y-1/2 h-4 bg-[linear-gradient(to_right,var(--color-amber-200),var(--color-teal-200),var(--color-violet-300),var(--color-fuchsia-300))]"
                            style={{
                                maskImage: `url(${underlineImage.src})`,
                                maskSize: 'contain',
                                maskPosition: 'center',
                                maskRepeat: 'no-repeat',
                            }}
                        ></span>
                    </span>
                </h2>
                <div className="mt-6 flex flex-col lg:flex-row">
                    {/* left */}
                    <div className="relative rounded-t-2xl bg-cover-deals lg:w-1/3 lg:rounded-l-2xl lg:rounded-tr-none">
                        <div className="absolute inset-0 h-full w-full">
                            <Image
                                src={sparksImg}
                                alt="sparks"
                                width={706}
                                height={630}
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="absolute bottom-0 h-[150px] xl:h-[175px]">
                            <Image
                                src={smartphoneImg}
                                alt="smartphone"
                                width={289}
                                height={344}
                                className="h-full w-auto rounded-bl-2xl object-contain"
                            />
                        </div>
                        <div className="absolute top-0 h-[150px] xl:h-[175px]">
                            <Image
                                src={mixerImg}
                                alt="mixer"
                                width={298}
                                height={301}
                                className="h-full w-auto rounded-tl-2xl object-contain"
                            />
                        </div>
                        <div className="absolute right-0 top-[-25px] h-[150px] xl:top-[-30px] xl:h-[175px]">
                            <Image
                                src={controllerImg}
                                alt="controller"
                                width={265}
                                height={314}
                                className="h-full w-auto object-contain"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 h-[125px]">
                            <Image
                                src={smartwatchImg}
                                alt="smartwatch"
                                width={188}
                                height={242}
                                className="h-full w-auto object-contain"
                            />
                        </div>
                        <div className="relative flex h-full w-full flex-col items-center justify-center py-8 text-white">
                            <div className="mb-5 h-8">
                                <Image
                                    src={saveUpImg}
                                    alt="save up"
                                    width={153}
                                    height={35}
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                            <h3 className="text-base md:text-lg">Today Deals</h3>
                            <span className="text-2xl font-extrabold">23 : 35 : 51</span>
                            <Link href={'/collections/top-deals'}>
                                <button className="mt-5 h-8 rounded-md !bg-white px-3 text-xs font-extrabold text-gray-700">
                                    Shop all Deals
                                </button>
                            </Link>
                            <div className="mt-3 h-9">
                                <Image
                                    src={dealAddedDailyImg}
                                    alt="dealAddedDaily"
                                    width={183}
                                    height={39}
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    {/* right */}
                    <div className="relative rounded-b-2xl bg-gray-200 px-4 lg:w-2/3 lg:rounded-l-none lg:rounded-r-2xl lg:py-0 lg:pr-0">
                        <div className="w-full">
                            <div>
                                <TopDealsSlider />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
