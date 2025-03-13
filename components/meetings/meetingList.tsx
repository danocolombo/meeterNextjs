'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import MeetingListSkeleton from '../skeletons/MeetingListSkeleton';
import MeetingCard from './meetingCard';
import { currentUser } from '@clerk/nextjs/server';
import axios from 'axios';

export interface Meeting {
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
    const apiTokenRef = useRef<string>('');
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchMetadata = async () => {
        try {
            const clerkResponse = await axios.get('/api/clerkMeta');
            if (!clerkResponse.data?.data?.privateMetadata?.meeter) {
                throw new Error('Invalid clerk metadata response');
            }

            const { orgId, apiToken } =
                clerkResponse.data.data.privateMetadata.meeter;
            if (!orgId || !apiToken) {
                throw new Error(
                    'Organization ID or API Token is not available'
                );
            }

            setOrgId(orgId);
            apiTokenRef.current = apiToken;
            return { orgId, apiToken };
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch metadata'
            );
            return null;
        }
    };

    const transformMeetingData = (meetings: Meeting[]) => {
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

    const refreshApiToken = async (): Promise<string | null> => {
        try {
            const response = await axios.get('/api/token/refresh');
            return response.data?.token ?? null;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return null;
        }
    };

    const getMeetings = useCallback(
        async (
            orgId: string,
            apiToken: string,
            page: number = 1,
            isRetry: boolean = false
        ) => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;
                const url = `${baseUrl}/meetings/${orgId}?direction=DESC&page=${page}`;

                // Try to refresh token before making the request
                let currentToken = apiToken;
                if (!isRetry) {
                    const newToken = await refreshApiToken();
                    if (newToken) {
                        currentToken = newToken;
                        apiTokenRef.current = newToken;
                        console.log('Token refreshed before request');
                    }
                }

                try {
                    console.log(
                        'Making request with token:',
                        currentToken.substring(0, 10) + '...'
                    );
                    const response = await axios.get<ApiResponse>(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentToken}`,
                        },
                    });

                    if (response?.data?.status === 200 && response.data.data) {
                        const transformedMeetings = transformMeetingData(
                            response.data.data.data
                        );
                        setMeetings((prev) =>
                            page === 1
                                ? transformedMeetings
                                : [...prev, ...transformedMeetings]
                        );
                        setPagination({
                            current_page: response.data.data.current_page,
                            total_pages: response.data.data.last_page,
                            per_page: response.data.data.per_page,
                            total: response.data.data.total,
                        });
                    }
                } catch (error: any) {
                    console.error('Request failed:', error.response?.status);
                    if (error.response?.status === 401 && !isRetry) {
                        console.log('Retrying with new token...');
                        const newToken = await refreshApiToken();
                        if (newToken) {
                            return getMeetings(orgId, newToken, page, true);
                        }
                    }
                    throw error;
                }
            } catch (err) {
                console.error('Error fetching meetings:', err);
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
    );

    const loadMore = useCallback(() => {
        if (
            pagination &&
            !loadingMore &&
            pagination.current_page < pagination.total_pages
        ) {
            setLoadingMore(true);
            getMeetings(
                orgId,
                apiTokenRef.current,
                pagination.current_page + 1
            );
        }
    }, [pagination, loadingMore, orgId, getMeetings]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore]);

    useEffect(() => {
        const initializeData = async () => {
            const metadata = await fetchMetadata();
            if (metadata) {
                await getMeetings(metadata.orgId, metadata.apiToken, 1);
            }
        };

        initializeData();
    }, [getMeetings]);

    if (loading && !loadingMore) return <MeetingListSkeleton />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='relative'>
            <h1 className='text-2xl font-semibold mb-1 capitalize'>Meetings</h1>
            <Link
                href='/meeting/0'
                className='absolute top-0 right-20 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md'
            >
                <span className='text-2xl'>++</span>
            </Link>
            <Link
                href='/meeting/new/basics'
                className='absolute top-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md'
            >
                <span className='text-2xl'>+</span>
            </Link>
            <div className='grid md:grid-cols-2 gap-4 mt-   2'>
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
