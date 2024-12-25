'use client';
import { LuMinus, LuPlus } from 'react-icons/lu';

import { Button } from '../ui/button';
import { useState } from 'react';

function NumberInput({
    reference,
    defaultValue,
}: {
    reference: string;
    defaultValue?: number;
}) {
    const [count, setCount] = useState(defaultValue || 0);
    const increaseCount = () => {
        setCount((prevCount) => prevCount + 1);
    };
    const decreaseCount = () => {
        setCount((prevCount) => {
            if (prevCount > 0) {
                return prevCount - 1;
            }
            return prevCount;
        });
    };
    return (
        <div className='flex items-center gap-4'>
            <input type='hidden' name={reference} value={count} />
            <Button
                variant='outline'
                size='icon'
                type='button'
                onClick={decreaseCount}
            >
                <LuMinus className='w-5 h-5 text-primary' />
            </Button>
            <span className='text-xl font-bold w-5 text-center'>{count}</span>
            <Button
                variant='outline'
                size='icon'
                type='button'
                onClick={increaseCount}
            >
                <LuPlus className='w-5 h-5 text-primary' />
            </Button>
        </div>
    );
}

export default NumberInput;
