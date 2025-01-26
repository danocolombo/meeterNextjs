import React from 'react';
import { printObject } from '@/utils/helpers';
const MeetingListSkeleton = () => {
    return (
        <div className='grid md:grid-cols-2 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className='p-4 border rounded shadow animate-pulse'
                >
                    <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                </div>
            ))}
        </div>
    );
};

export default MeetingListSkeleton;
