'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

export default function CheckboxHeader({ categoryIds }: { categoryIds: string[] }) {
    const [isChecked, setIsChecked] = useState(false);

    // Hàm xử lý khi checkbox header thay đổi
    const handleHeaderChange = () => {
        setIsChecked(!isChecked);

        // Cập nhật tất cả các checkbox trong form
        const form = document.getElementById('category-table-form') as HTMLFormElement;
        if (form) {
            const checkboxes = form.querySelectorAll('input[name="selectedIds"]');
            checkboxes.forEach((checkbox) => {
                (checkbox as HTMLInputElement).checked = !isChecked;
            });
        }
    };

    // Nếu danh sách categoryIds thay đổi, kiểm tra lại trạng thái
    useEffect(() => {
        const form = document.getElementById('category-table-form') as HTMLFormElement;
        if (form) {
            const checkboxes = form.querySelectorAll('input[name="selectedIds"]');
            const allChecked = Array.from(checkboxes).every((checkbox) => (checkbox as HTMLInputElement).checked);
            setIsChecked(allChecked);
        }
    }, [categoryIds]);

    return (
        <>
            <label className="neon-checkbox" data-tooltip-id="header-checkbox" data-tooltip-content="Select All">
                <input type="checkbox" checked={isChecked} onChange={handleHeaderChange} className="w-4 h-4" />

                <div className="neon-checkbox__frame">
                    <div className="neon-checkbox__box">
                        <div className="neon-checkbox__check-container">
                            <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                                <path d="M3,12.5l7,7L21,5"></path>
                            </svg>
                        </div>
                        <div className="neon-checkbox__glow"></div>
                        <div className="neon-checkbox__borders">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className="neon-checkbox__effects">
                        <div className="neon-checkbox__particles">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="neon-checkbox__rings">
                            <div className="ring"></div>
                            <div className="ring"></div>
                            <div className="ring"></div>
                        </div>
                        <div className="neon-checkbox__sparks">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </label>
            <Tooltip id="header-checkbox" style={{ fontWeight: '400' }} />
        </>
    );
}
