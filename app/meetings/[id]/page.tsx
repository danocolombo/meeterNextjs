'use client';

import GroupsComponent from '@/components/groups/page';
import MeetingForm from '@/components/meetings/meetingForm';
import MeetingFormSkeleton from '@/components/skeletons/MeetingFormSkeleton';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Group } from 'lucide-react';
import React from 'react';
import { printObject } from '@/utils/helpers';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export type MeetingType = {
    id?: string | null;
    created_at?: string | null; // Assuming format is compatible with Date
    updated_at?: string | null;
    meeting_date?: string | null; // Assuming format is compatible with Date
    title?: string | null;
    meeting_type?: string | null;
    mtg_comp_key?: string | null;
    announcements_contact?: string | null;
    attendance_count?: number | null;
    av_contact?: string | null;
    cafe_contact?: string | null;
    cafe_count?: number | null;
    children_contact?: string | null;
    children_count?: number | null;
    cleanup_contact?: string | null;
    closing_contact?: string | null;
    donations?: number | null;
    facilitator_contact?: string | null;
    greeter_contact1?: string | null;
    greeter_contact2?: string | null;
    meal?: string | null;
    meal_contact?: string | null;
    meal_count?: number | null;
    newcomers_count?: number | null;
    notes?: string | null;
    nursery_contact?: string | null;
    nursery_count?: number | null;
    resource_contact?: string | null;
    security_contact?: string | null;
    setup_contact?: string | null;
    support_contact?: string | null;
    transportation_contact?: string | null;
    transportation_count?: number | null;
    worship?: string | null;
    youth_contact?: string | null;
    youth_count?: number | null;
    organization_id?: string | null;
    groups?: GroupType[]; // Changed from [GroupType] to GroupType[]
};
export type GroupType = {
    id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    meeting_date?: string | null;
    grp_comp_key?: string | null;
    title?: string | null;
    location?: string | null;
    gender?: string | null;
    attendance?: number | null;
    facilitator?: string | null;
    notes?: string | null;
    meeting_id?: string | null;
    organization_id?: string | null;
    cofacilitator?: string | null;
};

interface PageProps {
    params: {
        id: string;
    };
}

const MeetingPage = ({ params }: PageProps) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [meetingData, setMeetingData] = useState<MeetingType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [newGroupIds, setNewGroupIds] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState<Partial<MeetingType>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Skip API call if id is "0" (new meeting)
                if (params.id === '0') {
                    setMeetingData({
                        meeting_date: new Date().toISOString().split('T')[0],
                        title: '',
                        meeting_type: '',
                        groups: [],
                    });
                    setIsLoading(false);
                    return;
                }

                // Fetch clerk metadata first
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

                // Only proceed with meeting data fetch if we have valid clerk data
                const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting/${orgId}/${params.id}`;
                const response = await axios.get(endpoint, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiToken}`,
                    },
                });
                if (response?.data?.status === 200) {
                    setMeetingData(response?.data?.data);
                } else {
                    throw new Error('Failed to fetch meeting data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(
                    error instanceof Error ? error.message : 'An error occurred'
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [params.id, user]); // Remove clerkInfo from dependencies

    const handleFormChange = (updatedFields: Partial<MeetingType>) => {
        // Update both meetingData and formData simultaneously
        setMeetingData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                ...updatedFields,
            };
        });

        setFormData((prev) => ({
            ...prev,
            ...updatedFields,
            // Ensure we're capturing the meeting ID and organization_id
            id: params.id === '0' ? null : params.id,
            organization_id: meetingData?.organization_id,
        }));
    };

    const handleUpdate = async () => {
        if (!meetingData) return;

        try {
            // Get clerk metadata for API token
            const clerkResponse = await axios.get('/api/clerkMeta');
            const apiToken =
                clerkResponse.data?.data?.privateMetadata?.meeter?.apiToken;

            if (!apiToken) {
                throw new Error('API Token is not available');
            }

            const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting`;
            const method = params.id === '0' ? 'POST' : 'PUT';

            const response = await axios({
                method,
                url: endpoint,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiToken}`,
                },
                data: formData,
            });

            if (response.status === 200) {
                console.log('Meeting saved successfully');
                // Optionally redirect or show success message
            }
        } catch (error) {
            console.error('Error saving meeting:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to save meeting'
            );
        }
    };

    const handleAddGroup = () => {
        // this will insert a new group into the meetingData
        if (!meetingData) return;

        // Generate a temporary ID - NOTE: this will NOT be the final ID, it is defined by API POST
        const tempId = `NEW_${Math.random()}`;
        const newGroup: GroupType = {
            id: tempId,
            created_at: null,
            updated_at: null,
            meeting_date: meetingData.meeting_date || null,
            grp_comp_key: null,
            title: null,
            location: null,
            gender: null,
            attendance: null,
            facilitator: null,
            notes: null,
            meeting_id: meetingData.id || null,
            organization_id: meetingData.organization_id || null,
            cofacilitator: null,
        };
        // save the new group id to the state
        setNewGroupIds((prev) => new Set(prev).add(tempId));
        // insert the new group into the meetingData
        setMeetingData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                groups: [...(prev.groups || []), newGroup],
            };
        });
    };

    const handleDeleteGroup = (groupId: string) => {
        setMeetingData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                groups:
                    prev.groups?.filter((group) => group.id !== groupId) || [],
            };
        });
        // Remove from newGroupIds if it was a new group
        setNewGroupIds((prev) => {
            const next = new Set(prev);
            next.delete(groupId);
            return next;
        });
    };

    const handleGroupUpdate = (groupId: string, updatedGroup: GroupType) => {
        setMeetingData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                groups:
                    prev.groups?.map((group) =>
                        group.id === groupId
                            ? { ...group, ...updatedGroup }
                            : group
                    ) || [],
            };
        });
    };

    if (isLoading) {
        return <MeetingFormSkeleton />;
    }

    if (error) {
        return <div className='text-red-500'>Error: {error}</div>;
    }

    if (!meetingData) {
        return <div>Meeting not found</div>;
    }

    return (
        <div className='space-y-8'>
            <div className='text-2xl font-bold text-blue-800 dark:text-blue-400'>
                Meeting
            </div>
            <MeetingForm
                meeting={meetingData}
                onFormChange={handleFormChange}
            />
            <div className='grid gap-4'>
                {meetingData.groups?.map((group) => (
                    <GroupsComponent
                        key={group.id || Math.random()}
                        group={group}
                        isNew={group.id ? newGroupIds.has(group.id) : false}
                        onDelete={handleDeleteGroup}
                        onUpdate={handleGroupUpdate}
                    />
                ))}
            </div>
            <div className='flex justify-between'>
                <Button
                    variant='default'
                    className='w-1/3'
                    onClick={handleAddGroup}
                >
                    Add New Group
                </Button>
                <Button
                    variant='default'
                    className='w-1/3'
                    onClick={handleUpdate}
                >
                    Update
                </Button>
            </div>
        </div>
    );
};

export default MeetingPage;
