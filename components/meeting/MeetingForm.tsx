'use client';

import { useForm } from 'react-hook-form';

import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import MeetingFormSkeleton from '@/components/skeletons/MeetingFormSkeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { meetingFormSchema, type MeetingFormData } from '@/lib/schemas/meeting';
import FormInput from '@/components/form/FormInput';
import GroupsComponent from '@/components/groups/GroupForm';
import { Button } from '@/components/ui/button';
import { printObject } from '@/utils/helpers';

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
interface MeetingFormProps {
    id: string;
    showToast?: (message: string, type: string) => void;
}

const MeetingForm = ({ id, showToast }: MeetingFormProps) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [meetingData, setMeetingData] = useState<MeetingType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingGroups, setPendingGroups] = useState<GroupType[]>([]);
    const [newGroupIds, setNewGroupIds] = useState<Set<string>>(new Set());
    const [groupsChanged, setGroupsChanged] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<MeetingFormData>({
        resolver: zodResolver(meetingFormSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            meeting_date: new Date().toISOString().split('T')[0],
            meeting_type: '',
            attendance_count: 0,
            facilitator_contact: '',
            support_contact: '',
            meal: '',
            meal_contact: '',
            meal_count: 0,
            newcomers_count: 0,
            notes: '',
        },
    });

    // Update form values when meetingData changes
    useEffect(() => {
        if (meetingData) {
            form.reset({
                title: meetingData.title || '',
                meeting_date: meetingData.meeting_date || '',
                meeting_type: meetingData.meeting_type || '',
                attendance_count: meetingData.attendance_count || 0,
                facilitator_contact: meetingData.facilitator_contact || '',
                support_contact: meetingData.support_contact || '',
                meal: meetingData.meal || '',
                meal_contact: meetingData.meal_contact || '',
                meal_count: meetingData.meal_count || 0,
                newcomers_count: meetingData.newcomers_count || 0,
                notes: meetingData.notes || '',
            });
        }
    }, [meetingData, form]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Skip API call if id is "0" (new meeting)
                if (id === '0') {
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
                const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting/${orgId}/${id}`;
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
    }, [id, user]); // Remove clerkInfo from dependencies

    const handleUpdate = async (formData: MeetingFormData) => {
        if (!meetingData) return { message: 'No meeting data available' };
        setIsSubmitting(true);

        try {
            const clerkResponse = await axios.get('/api/clerkMeta');
            const apiToken =
                clerkResponse.data?.data?.privateMetadata?.meeter?.apiToken;

            // console.log('🟨 => MeetingForm.tsx:193 => apiToken:', apiToken);

            // console.log(
            //     '🟨 => MeetingForm.tsx:196 => clerkResponse:',
            //     clerkResponse
            // );

            if (!apiToken) {
                throw new Error('API Token is not available');
            }
            // Combine the latest form data with groups
            const vault = {
                ...formData,
                groups: [
                    ...(meetingData.groups || []), // Existing validated groups
                    ...pendingGroups, // New validated groups
                ],
            };

            // Combine form data with existing meeting data
            // console.log(
            //     '🟨 => MeetingForm.tsx:214 => pendingGroups:',
            //     pendingGroups
            // );
            const formMeetingData = {
                // apiToken,
                // organizationId: meetingData.organization_id,
                ...meetingData,
                ...vault,
                // ...formData,
                // groups: meetingData.groups, // Ensure groups are always included
            };

            // Make the API call based on whether it's a new meeting or an update
            let response = null;
            if (id === '0') {
                printObject('🌼🌼🌼 MF:230->formMeetingData', formMeetingData);
                response = await axios({
                    method: 'POST',
                    url: `/api/meeting`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiToken}`,
                    },
                    data: formMeetingData,
                });
            } else {
                response = await axios({
                    method: 'PUT',
                    url: `/api/meeting/${id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiToken}`,
                    },
                    data: formMeetingData,
                });
            }
            console.log('🟨 => MeetingForm.tsx:250 => response:', response);

            // const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting`;
            // const method = id === '0' ? 'POST' : 'PUT';

            // const response = await axios({
            //     method,
            //     url: endpoint,
            //     headers: {
            //         'Content-Type': 'application/json',
            //         Authorization: `Bearer ${apiToken}`,
            //     },
            //     data: updatedMeetingData,
            // });
            // const response = { status: 200 };
            if (response.status === 200) {
                // Update local meetingData to match server
                setMeetingData(formMeetingData);
                // Reset form state but keep the current values
                form.reset(formData, {
                    keepValues: true,
                    keepDirty: false,
                    keepErrors: false,
                    keepTouched: false,
                    keepIsSubmitted: false,
                    keepSubmitCount: false,
                });
                // Reset groups changed flag
                setGroupsChanged(false);
                showToast?.('Meeting saved successfully', 'success');
                return { message: 'Meeting saved successfully' };
            }
            return { message: 'Failed to save meeting' };
        } catch (error) {
            console.error('Error saving meeting:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to save meeting';
            setError(errorMessage);
            showToast?.(errorMessage, 'error');
            return { message: 'Error saving meeting' };
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddGroup = () => {
        // Generate a temporary ID for the pending group
        const newGroup: GroupType = {
            id: '0',
            created_at: null,
            updated_at: null,
            meeting_date: meetingData?.meeting_date || null,
            grp_comp_key: null,
            title: null,
            location: null,
            gender: null,
            attendance: null,
            facilitator: null,
            notes: null,
            meeting_id: meetingData?.id || null,
            organization_id: meetingData?.organization_id || null,
            cofacilitator: null,
        };

        // Add to pending groups instead of meetingData
        setPendingGroups((prev) => [...prev, newGroup]);
        console.log(
            '🟨 => MeetingForm.tsx:305 => setPendingGroups:',
            setPendingGroups
        );
    };

    const handleGroupValidated = (
        groupId: string,
        validatedGroup: GroupType
    ) => {
        const tempId = `PENDING_${Math.random()}`;
        // Remove from pending groups
        setPendingGroups((prev) => prev.filter((g) => g.id !== groupId));

        let tmpGroup = {
            ...validatedGroup,
            id: tempId,
        };
        // Add to meetingData
        setMeetingData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                groups: [...(prev.groups || []), tmpGroup],
            };
        });

        setNewGroupIds((prev) => new Set(prev).add(groupId));
        setGroupsChanged(true);
    };

    const handleDeleteGroup = (groupId: string) => {
        // Check if it's a pending group first
        if (groupId.startsWith('PENDING_')) {
            setPendingGroups((prev) => prev.filter((g) => g.id !== groupId));
            return;
        }

        // Otherwise handle as before
        setMeetingData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                groups:
                    prev.groups?.filter((group) => group.id !== groupId) || [],
            };
        });
        setNewGroupIds((prev) => {
            const next = new Set(prev);
            next.delete(groupId);
            return next;
        });
        setGroupsChanged(true);
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
        setGroupsChanged(true); // Mark groups as changed
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
                Meeting {id}
            </div>
            <div className='form-container'>
                <form onSubmit={form.handleSubmit(handleUpdate)}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('title')}
                                type='text'
                                className='form-input'
                                label='Title'
                                error={form.formState.errors.title?.message}
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('meeting_date')}
                                type='date'
                                className='form-input'
                                label='Meeting Date'
                                error={
                                    form.formState.errors.meeting_date?.message
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('meeting_type')}
                                type='text'
                                className='form-input'
                                label='Meeting Type'
                                error={
                                    form.formState.errors.meeting_type?.message
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('attendance_count', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        const newValue =
                                            e.target.value === ''
                                                ? 0
                                                : parseInt(e.target.value);
                                        form.setValue(
                                            'attendance_count',
                                            newValue,
                                            {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            }
                                        );
                                    },
                                })}
                                type='number'
                                min='0'
                                className='form-input'
                                label='Attendance Count'
                                error={
                                    form.formState.errors.attendance_count
                                        ?.message
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('facilitator_contact')}
                                type='text'
                                className='form-input'
                                label='Facilitator Contact'
                                error={
                                    form.formState.errors.facilitator_contact
                                        ?.message
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('support_contact')}
                                type='text'
                                className='form-input'
                                label='Support Contact'
                                error={
                                    form.formState.errors.support_contact
                                        ?.message
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('meal')}
                                type='text'
                                className='form-input'
                                label='Meal'
                                error={form.formState.errors.meal?.message}
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('meal_contact')}
                                type='text'
                                className='form-input'
                                label='Meal Contact'
                                error={
                                    form.formState.errors.meal_contact?.message
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('meal_count', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        const newValue =
                                            e.target.value === ''
                                                ? 0
                                                : parseInt(e.target.value);
                                        form.setValue('meal_count', newValue, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                    },
                                })}
                                type='number'
                                min='0'
                                className='form-input'
                                label='Meal Count'
                                error={
                                    form.formState.errors.meal_count?.message
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <FormInput
                                {...form.register('newcomers_count', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        const newValue =
                                            e.target.value === ''
                                                ? 0
                                                : parseInt(e.target.value);
                                        form.setValue(
                                            'newcomers_count',
                                            newValue,
                                            {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            }
                                        );
                                    },
                                })}
                                type='number'
                                min='0'
                                className='form-input'
                                label='Newcomers Count'
                                error={
                                    form.formState.errors.newcomers_count
                                        ?.message
                                }
                            />
                        </div>
                    </div>

                    {/* Notes input - Full width */}
                    <div className='form-group mt-4 w-full'>
                        <FormInput
                            {...form.register('notes')}
                            type='text'
                            className='form-input w-full'
                            label='Notes'
                            error={form.formState.errors.notes?.message}
                        />
                    </div>

                    <div className='flex justify-end mt-4'>
                        <Button
                            variant='default'
                            className='w-1/3'
                            type='submit'
                            disabled={
                                (!form.formState.isDirty && !groupsChanged) ||
                                isSubmitting ||
                                !form.formState.isValid
                            }
                        >
                            {id === '0'
                                ? isSubmitting
                                    ? 'Saving...'
                                    : 'Save'
                                : isSubmitting
                                ? 'Updating...'
                                : 'Update'}
                        </Button>
                    </div>
                </form>

                {/* Groups section moved outside the main form */}
                <div className='mt-8'>
                    <div className='grid gap-4'>
                        {meetingData.groups?.map((group) => (
                            <GroupsComponent
                                key={group.id || Math.random()}
                                group={group}
                                isNew={
                                    group.id ? newGroupIds.has(group.id) : false
                                }
                                onDelete={handleDeleteGroup}
                                onUpdate={handleGroupUpdate}
                                onValidated={handleGroupValidated}
                            />
                        ))}
                        {pendingGroups.map((group) => (
                            <GroupsComponent
                                key={group.id}
                                group={group}
                                isNew={true}
                                isPending={true}
                                onDelete={handleDeleteGroup}
                                onUpdate={handleGroupUpdate}
                                onValidated={handleGroupValidated}
                            />
                        ))}
                    </div>
                    {id !== '0' && (
                        <div className='mt-4'>
                            <Button
                                variant='default'
                                className='w-1/3'
                                onClick={handleAddGroup}
                                type='button'
                            >
                                Add New Group
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingForm;
