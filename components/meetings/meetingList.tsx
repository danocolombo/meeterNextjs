'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { printObject } from '@/utils/helpers';
import MeetingListSkeleton from '../skeletons/MeetingListSkeleton';
import axios from 'axios';

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

const MeetingsList = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orgId, setOrgId] = useState<string>('');
    const [apiToken, setApiToken] = useState<string>('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const clerkResponse = await axios.get('/api/clerkMeta');
                if (!clerkResponse.data) {
                    throw new Error('Failed to fetch clerk metadata');
                }
                const orgId =
                    clerkResponse.data?.data?.privateMetadata?.meeter?.orgId;
                const apiToken =
                    clerkResponse.data?.data?.privateMetadata?.meeter?.apiToken;

                if (!orgId || !apiToken) {
                    throw new Error(
                        'Organization ID or API Token is not available'
                    );
                }

                setOrgId(orgId);
                setApiToken(apiToken);
                return { orgId, apiToken };
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch metadata'
                );
                return null;
            }
        };

        const getMeetings = async (orgId: string, apiToken: string) => {
            try {
                const response = await fetch(
                    `/api/jericho/meetings/organization/${orgId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            jerichoToken: apiToken,
                            organizationId: orgId,
                        },
                    }
                );

                const responseData: ApiResponse = await response.json();

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

        const initializeData = async () => {
            const metadata = await fetchMetadata();
            if (metadata) {
                await getMeetings(metadata.orgId, metadata.apiToken);
            }
        };

        initializeData();
    }, []);

    if (loading) return <MeetingListSkeleton />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='relative'>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>Meetings</h1>
            <Link
                href='/meeting/new/basics'
                className='absolute top-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md'
            >
                <span className='text-2xl'>+</span>
            </Link>
            <div className='grid md:grid-cols-2 gap-4 mt-12'>
                {Array.isArray(meetings) && meetings.length > 0 ? (
                    meetings.map((meeting: Meeting) => (
                        <Link
                            key={meeting.id}
                            href={{
                                pathname: `/meeting/${meeting.id}`,
                            }}
                        >
                            <div className='meetings-list-card'>
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
        </div>
    );
};

export default MeetingsList;
