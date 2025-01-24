// FILE: components/SkeletonDefinitions.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SkeletonDefinitions() {
    return (
        <div className='p-4'>
            <h2 className='text-xl mb-4'>Skeleton Definitions</h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                <div className='w-full'>
                    <Skeleton className='h-[300px] w-full rounded-md' />
                </div>
                <div className='w-full'>
                    <Skeleton className='h-[200px] w-full rounded-md' />
                </div>
                <div className='w-full'>
                    <Skeleton className='h-[100px] w-full rounded-md' />
                </div>
                <div className='w-full'>
                    <Skeleton className='h-[50px] w-full rounded-md' />
                </div>
            </div>
        </div>
    );
}

export default SkeletonDefinitions;
