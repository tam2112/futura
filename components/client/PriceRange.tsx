'use client';
import { useState } from 'react';
import { DualRangeSlider } from '../slider';
import { debounce } from 'lodash';

interface PriceRangeProps {
    onPriceRangeChange: (values: number[]) => void;
    maxPrice: number;
}

export default function PriceRange({ onPriceRangeChange, maxPrice }: PriceRangeProps) {
    const [values, setValues] = useState([0, maxPrice]);
    const debouncedSetPriceRange = debounce(setValues, 300);

    const handleValueChange = (newValues: number[]) => {
        debouncedSetPriceRange(newValues);
        onPriceRangeChange(newValues);
    };

    return (
        <>
            <DualRangeSlider value={values} onValueChange={handleValueChange} min={0} max={maxPrice} step={0.1} />
        </>
    );
}
