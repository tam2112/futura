'use client';
import { useState } from 'react';
import { DualRangeSlider } from '../slider';

interface PriceRangeProps {
    onPriceRangeChange: (values: number[]) => void;
}

export default function PriceRange({ onPriceRangeChange }: PriceRangeProps) {
    const [values, setValues] = useState([0, 2010]);

    const handleValueChange = (newValues: number[]) => {
        setValues(newValues);
        onPriceRangeChange(newValues);
    };

    return (
        <>
            <DualRangeSlider
                // label={() => <>$</>}
                // lableContenPos={'left'}
                value={values}
                onValueChange={handleValueChange}
                min={0}
                max={2010}
                step={0.1}
            />
        </>
    );
}
