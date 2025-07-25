'use client';

import { useState } from 'react';

export default function Checkbox({ id }: { id: string | number }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = () => {
        setIsChecked(!isChecked);

        // Cập nhật trạng thái của CheckboxHeader
        const form = document.getElementById('table-container');
        if (form) {
            const checkboxes = form.querySelectorAll('input[name="selectedIds"]');
            const allChecked = Array.from(checkboxes).every((checkbox) => (checkbox as HTMLInputElement).checked);
            const headerCheckbox = form.querySelector('input[type="checkbox"]:not([name="selectedIds"])');
            if (headerCheckbox) {
                (headerCheckbox as HTMLInputElement).checked = allChecked;
            }
        }
    };

    return (
        <label className="neon-checkbox">
            <input
                type="checkbox"
                name="selectedIds"
                value={id}
                checked={isChecked}
                onChange={handleChange}
                className="w-4 h-4"
            />
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
    );
}
