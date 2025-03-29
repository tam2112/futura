import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const count = 10;
const ITEM_PER_PAGE = 2;
const page = 1;

export default function Pagination() {
    return (
        <div className="flex items-center justify-center py-8 space-x-4">
            <button className="py-3 px-4 rounded-md bg-gray-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                <SlArrowLeft />
            </button>
            <div className="flex items-center gap-2 text-sm">
                {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }, (_, index) => {
                    const pageIndex = index + 1;

                    return (
                        <button
                            key={pageIndex}
                            className={`px-4 py-2 rounded-lg ${page === pageIndex ? 'bg-gradient-light' : ''}`}
                        >
                            {pageIndex}
                        </button>
                    );
                })}
            </div>
            <button className="py-3 px-4 rounded-md bg-gray-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                <SlArrowRight />
            </button>
        </div>
    );
}
