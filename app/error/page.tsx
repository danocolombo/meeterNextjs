'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';

const ErrorPage = () => {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    // Get all params and filter out message since we're handling it separately
    const otherParams = Array.from(searchParams.entries()).filter(
        ([key]) => key !== 'message'
    );

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white'>
            <div className='text-2xl font-bold text-red-600 mb-4'>Error</div>
            {message && (
                <div className='text-xl text-gray-800 mb-4'>
                    {decodeURIComponent(message)}
                </div>
            )}
            {otherParams.length > 0 && (
                <div className='text-sm text-gray-600 mt-4'>
                    <h3 className='font-semibold mb-2'>
                        Additional Information:
                    </h3>
                    {otherParams.map(([key, value]) => (
                        <div key={key}>
                            <span className='font-medium'>{key}:</span>{' '}
                            {decodeURIComponent(value)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ErrorPage;
//http://localhost:3000/error?message=Authentication+failed
