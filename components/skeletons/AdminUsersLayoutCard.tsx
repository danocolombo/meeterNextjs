// FILE: components/SkeletonDefinitions.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminUserCardSkeleton() {
    return (
        <div className='max-w-lg mx-auto p-4 border rounded-md shadow-md'>
            <div className='p-4 border rounded-md shadow-md'>
                <Skeleton className='h-10 w-10 rounded-full mb-4' />
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-6 w-1/2 mb-2' />
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-full mb-2' />
            </div>
        </div>
    );
}

export default AdminUserCardSkeleton;
