'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { printObject } from '@/utils/helpers';
import MeetingListSkeleton from '../skeletons/MeetingListSkeleton';

interface Meeting {
    id: string;
    meeting_date: string;
    title: string;
    meeting_type: string;
    support_contact: string | null;
    groups: Array<{
        id: string;
        title: string;
        location: string;
        facilitator: string;
    }>;
}

interface ApiResponse {
    status: number;
    message: string;
    data: Meeting[];
    paginationData: {
        data: {
            current_page: number;
            per_page: number;
            total: number;
        };
    };
}

const MeetingsList = ({
    apiToken,
    orgId,
}: {
    apiToken: string;
    orgId: string;
}) => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getMeetings = async () => {
            try {
                if (!apiToken) {
                    throw new Error('No API token available');
                }
                const response = await fetch(
                    `/api/jericho/meetings/organization/${orgId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            jerichoToken: apiToken,
                        },
                    }
                );

                const responseData: ApiResponse = await response.json();
                console.log('Response data:', responseData);

                if (
                    responseData.status === 200 &&
                    Array.isArray(responseData.data)
                ) {
                    setMeetings(responseData.data);
                } else {
                    throw new Error('Invalid response format');
                }
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

    if (loading) return <MeetingListSkeleton />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='grid md:grid-cols-2 gap-4'>
            {Array.isArray(meetings) && meetings.length > 0 ? (
                meetings.map((meeting: Meeting) => (
                    <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                        <div className='p-4 border rounded shadow hover:shadow-md'>
                            <h3 className='font-bold'>{meeting.title}</h3>
                            <p>Date: {meeting.meeting_date}</p>
                            <p>Type: {meeting.meeting_type}</p>
                            {meeting.groups.length > 0 && (
                                <p>Groups: {meeting.groups.length}</p>
                            )}
                        </div>
                    </Link>
                ))
            ) : (
                <div>No meetings found</div>
            )}
        </div>
    );
};

export default MeetingsList;
