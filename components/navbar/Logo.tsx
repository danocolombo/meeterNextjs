import React from 'react';
import Link from 'next/link';
import { TbCircleLetterMFilled } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
function Logo() {
    return (
        <Button size='icon' asChild>
            <Link
                href='/'
                className='flex items-center justify-center bg-primary'
            >
                <TbCircleLetterMFilled
                    className='w-full h-full text-accent bg-primary'
                    size={150}
                />
            </Link>
        </Button>
    );
}

export default Logo;
