'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { printObject } from '@/utils/helpers';
import MeetingListSkeleton from '../skeletons/MeetingListSkeleton';
import MeetingCard from './meetingCard';
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
    attendance_count: number | null;
    meal_count: number | null;
    newcomers_count: number | null;
}

interface ApiResponse {
    status: number;
    message: string;
    data: {
        current_page: number;
        data: Meeting[];
        first_page_url: string;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface PaginationData {
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
}

const MeetingsList = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orgId, setOrgId] = useState<string>('');
    const [apiToken, setApiToken] = useState<string>('');
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchMetadata = async () => {
        try {
            const clerkResponse = await axios.get('/api/clerkMeta');
            if (!clerkResponse.data) {
                throw new Error('Failed to fetch clerk metadata');
            }

            // Get both orgId and API token from clerk metadata
            const orgId =
                clerkResponse.data?.data?.privateMetadata?.meeter?.orgId;
            const apiToken =
                clerkResponse.data?.data?.privateMetadata?.meeter?.apiToken;

            console.log('Clerk metadata:', { orgId, apiToken }); // Debug log

            if (!orgId || !apiToken) {
                throw new Error(
                    'Organization ID or API Token is not available'
                );
            }

            setOrgId(orgId);
            setApiToken(apiToken);
            return { orgId, apiToken };
        } catch (err) {
            console.log('🟨 => meetingList.tsx:98 => err:', err);

            setError(
                err instanceof Error ? err.message : 'Failed to fetch metadata'
            );
            return null;
        }
    };

    const transformMeetingData = (meetings: Meeting[]) => {
        // Filter out any duplicate meetings by ID
        const uniqueMeetings = meetings.reduce((acc: Meeting[], current) => {
            const exists = acc.find((meeting) => meeting.id === current.id);
            if (!exists) {
                acc.push(current);
            }
            return acc;
        }, []);

        return uniqueMeetings.map((meeting) => ({
            ...meeting,
            attendance_count: meeting.attendance_count ?? 0,
            meal_count: meeting.meal_count ?? 0,
            newcomers_count: meeting.newcomers_count ?? 0,
        }));
    };

    const getMeetings = useCallback(
        async (orgId: string, apiToken: string, page: number = 1) => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;
                const url = `${baseUrl}/meetings/${orgId}?direction=DESC&page=${page}`;

                console.log('Fetching meetings for page:', page);

                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData: ApiResponse = await response.json();

                if (responseData.status === 200 && responseData.data) {
                    const transformedMeetings = transformMeetingData(
                        responseData.data.data
                    );

                    setMeetings((prev) =>
                        page === 1
                            ? transformedMeetings
                            : [...prev, ...transformedMeetings]
                    );

                    setPagination({
                        current_page: responseData.data.current_page,
                        total_pages: responseData.data.last_page,
                        per_page: responseData.data.per_page,
                        total: responseData.data.total,
                    });
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch meetings'
                );
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        []
    ); // Empty dependency array since it doesn't depend on any external values

    const loadMore = useCallback(() => {
        if (
            pagination &&
            !loadingMore &&
            pagination.current_page < pagination.total_pages
        ) {
            setLoadingMore(true);
            getMeetings(orgId, apiToken, pagination.current_page + 1);
        }
    }, [pagination, loadingMore, orgId, apiToken, getMeetings]);

    // Move this effect before the initialization effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [loadMore]);

    // Initial data load effect
    useEffect(() => {
        const initializeData = async () => {
            const metadata = await fetchMetadata();
            if (metadata) {
                await getMeetings(metadata.orgId, metadata.apiToken, 1);
            }
        };

        initializeData();
    }, [getMeetings]); // Add getMeetings to dependency array

    if (loading && !loadingMore) return <MeetingListSkeleton />;
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
                    meetings.map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                    ))
                ) : (
                    <div>No meetings found</div>
                )}
            </div>
            {loadingMore && (
                <div className='text-center py-4'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
                </div>
            )}
            <div ref={observerTarget} className='h-20 mt-4' />
        </div>
    );
};

export default MeetingsList;
