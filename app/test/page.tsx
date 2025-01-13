/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import React, { useState } from 'react';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const fetchFromApi = async () => {
        console.log('fetching');
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/test', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            const jsonData = await res.json();
            setData(jsonData);
            console.log(jsonData);
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
            <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
                <div className='flex flex-col gap-4 items-center'>
                    MAIN PAGE
                    {error && <p className='text-red-500'>{error}</p>}
                    {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
                </div>
                <div>
                    <button
                        className='px-4 py-2 bg-yellow-50 text-black rounded cursor-pointer'
                        onClick={fetchFromApi}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Fetch Data'}
                    </button>
                </div>
            </main>
            <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
                <div>FOOTER</div>
            </footer>
        </div>
    );
}
