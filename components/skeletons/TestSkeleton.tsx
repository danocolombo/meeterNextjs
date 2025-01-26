// FILE: components/SkeletonDefinitions.tsx
import React from 'react';
import AdminUserCardSkeleton from '@/components/skeletons/AdminUsersLayoutCard';

function SkeletonDefinitions() {
    return (
        <div className='max-w-screen-lg mx-auto px-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className='min-w-[300px]'>
                        <AdminUserCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonDefinitions;
