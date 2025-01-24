'use client';
import React, { useEffect, useState } from 'react';
import SkeletonDefinitions from '@/components/skeletons/AdminUsersLayout';

function SkeletonTestPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <div className='p-4'>
            <h1 className='text-2xl mb-4'>Skeleton Test Page</h1>
            <SkeletonDefinitions />
        </div>
    );
}

export default SkeletonTestPage;
