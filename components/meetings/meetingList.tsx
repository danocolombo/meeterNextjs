'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { printObject } from '@/utils/helpers';

const STORAGE_KEY = 'jericho_api_token';

interface Meeting {
    id: string;
    mtg: {
        id: string;
        // add other meeting properties as needed
    };
}

const MeetingsList = ({ apiToken }: { apiToken: string }) => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentToken, setCurrentToken] = useState<string>('');
    printObject('CMML:15-->apiToken:\n', apiToken);

    // useEffect(() => {
    //     // Try to get existing token from localStorage
    //     const storedToken = localStorage.getItem(STORAGE_KEY);

    //     if (storedToken) {
    //         setCurrentToken(storedToken);
    //     } else if (apiToken) {
    //         // Store new token if provided
    //         localStorage.setItem(STORAGE_KEY, apiToken);
    //         setCurrentToken(apiToken);
    //     }
    // }, [apiToken]);

    useEffect(() => {
        const getMeetings = async () => {
            try {
                if (!apiToken) {
                    throw new Error('No API token available');
                }

                console.log('Fetching meetings with token:', currentToken);

                const response: any = await fetch(
                    '/api/jericho/meetings/organization/9abfdbc2-378d-4c69-b140-7c55c5db7222',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            jerichotoken: apiToken,
                        },
                    }
                );

                console.log('⚽️⚽️⚽️Response status:', response);

                // Ensure we're getting an array of meetings

                // setMeetings([]);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch meetings'
                );
                console.error('Error fetching meetings:', err);
            } finally {
                setLoading(false);
            }
        };

        if (apiToken) {
            console.log('YES');
            getMeetings();
        }
    }, [apiToken]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='grid md:grid-cols-2 gap-4'>
            {Array.isArray(meetings) && meetings.length > 0 ? (
                meetings.map((mtg: Meeting) => (
                    <Link key={mtg.id} href={`/admin/user/${mtg.id}`}>
                        <div>{mtg.mtg?.id || 'No ID'}</div>
                    </Link>
                ))
            ) : (
                <div>No meetings found</div>
            )}
        </div>
    );
};

export default MeetingsList;
