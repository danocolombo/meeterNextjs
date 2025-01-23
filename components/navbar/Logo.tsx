import React from 'react';
import Link from 'next/link';
import { TbCircleLetterMFilled } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import Meeter from '@/components/navbar/Meeter';
function Logo() {
    return (
        <Button size='logo' asChild>
            <Link
                href='/'
                className='flex items-center justify-center bg-primary'
            >
                <Meeter />
            </Link>
        </Button>
    );
}

export default Logo;
