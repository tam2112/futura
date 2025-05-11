'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

export default function CheckboxHeader({ itemIds }: { itemIds: string[] }) {
    const t = useTranslations('Common');

    const [isChecked, setIsChecked] = useState(false);

    // Hàm xử lý khi checkbox header thay đổi
    const handleHeaderChange = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);

        // Cập nhật tất cả các checkbox trong table
        const container = document.getElementById('table-container');
        if (container) {
            const checkboxes = container.querySelectorAll('input[name="selectedIds"]');
            checkboxes.forEach((checkbox) => {
                (checkbox as HTMLInputElement).checked = newCheckedState;
                // Kích hoạt sự kiện change để cập nhật trạng thái của Checkbox component
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    };

    // Kiểm tra trạng thái của tất cả checkbox khi categoryIds thay đổi
    useEffect(() => {
        const container = document.getElementById('table-container');
        if (container) {
            const checkboxes = container.querySelectorAll('input[name="selectedIds"]');
            const allChecked =
                checkboxes.length > 0 &&
                Array.from(checkboxes).every((checkbox) => (checkbox as HTMLInputElement).checked);
            setIsChecked(allChecked);
        }
    }, [itemIds]);

    return (
        <>
            <label className="neon-checkbox" data-tooltip-id="header-checkbox" data-tooltip-content={t('selectAll')}>
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
