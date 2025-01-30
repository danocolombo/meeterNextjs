'use client';
import React, { useState } from 'react';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { Button } from '@/components/ui/button';
import { MeetingType, GroupType } from '@/utils/types';
import { MEETING_TYPES, GROUP_LOCATIONS } from '@/utils/constants';
import { printObject } from '@/utils/helpers';

const NewMeetingForm = () => {
    const [step, setStep] = useState(1);
    const [meetingData, setMeetingData] = useState<MeetingType>({
        name: '',
        meeting_date: new Date().toISOString().split('T')[0], // Default to today's date
        title: '',
        meeting_type: 'Lesson',
        mtg_comp_key: '',
        announcements_contact: '',
        attendance_count: 0,
        av_contact: '',
        cafe_contact: '',
        cafe_count: 0,
        children_contact: '',
        children_count: 0,
        cleanup_contact: '',
        closing_contact: '',
        donations: 0,
        facilitator_contact: '',
        greeter_contact1: '',
        greeter_contact2: '',
        meal: '',
        meal_contact: '',
        meal_count: 0,
        newcomers_count: 0,
        notes: '',
        nursery_contact: '',
        nursery_count: 0,
        resource_contact: '',
        security_contact: '',
        setup_contact: '',
        support_contact: '',
        transportation_contact: '',
        transportation_count: 0,
        worship: '',
        youth_contact: '',
        youth_count: 0,
        organization_id: '',
    });
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [currentGroup, setCurrentGroup] = useState<GroupType>({
        id: '',
        meeting_date: '',
        grp_comp_key: '',
        title: '',
        location: 'Other',
        gender: 'Female',
        attendance: 0,
        facilitator: '',
        notes: '',
        meeting_id: '',
        organization_id: '',
        cofacilitator: '',
    });

    const handleMeetingSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<{ message: string }> => {
        // e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        setMeetingData((prevData) => ({
            ...prevData,
            meeting_date:
                formData.get('meetingDate')?.toString() ||
                new Date().toISOString().split('T')[0],
            title: formData.get('title')?.toString() || '',
            support_contact: formData.get('supportContact')?.toString() || '',
            meeting_type: formData.get('meetingType')?.toString() || 'Lesson',
            meal: formData.get('meal')?.toString() || '',
            meal_contact: formData.get('mealContact')?.toString() || '',
            meal_count: parseInt(formData.get('mealCount')?.toString() || '0'),
            attendance_count: parseInt(
                formData.get('attendanceCount')?.toString() || '0'
            ),
            notes: formData.get('notes')?.toString() || '',
        }));

        setStep(2);
        console.log('AMNP:67-->handleMeetingSubmit: Success');
        return { message: 'Success' };
    };

    const handleAddGroup = (e: React.FormEvent) => {
        e.preventDefault();
        setGroups([...groups, currentGroup]);
        setCurrentGroup({
            id: '',
            meeting_date: '',
            grp_comp_key: '',
            meeting_id: '',
            title: '',
            location: 'Other',
            gender: 'Female',
            attendance: 0,
            facilitator: '',
            cofacilitator: '',
            notes: '',
            organization_id: '',
        });
    };
    const handleFinalSubmit = async () => {
        const payload = {
            meeting: meetingData,
            groups: groups,
        };

        try {
            const response = await fetch('/api/jericho/meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                // Handle success (e.g., redirect or show success message)
            }
        } catch (error) {
            console.error('Error submitting meeting:', error);
        }
    };
    printObject('AMNP:133->meetingData:\n', meetingData);
    if (step === 1) {
        return (
            <FormContainer
                action={handleMeetingSubmit}
                className='bg-gray-200 dark:bg-gray-600 p-6 rounded-lg border border-gray-300 dark:border-gray-500 shadow-sm'
            >
                <h2 className='text-2xl font-bold mb-4'>New Meeting Details</h2>
                <div className='flex flex-col space-y-4'>
                    <div className='flex flex-col md:flex-row md:space-x-4'>
                        <div className='flex-1'>
                            <FormInput
                                name='title'
                                type='string'
                                required={true}
                                label='Title'
                                defaultValue={meetingData.title || ''}
                            />
                        </div>
                        <div className='flex-1'>
                            <FormInput
                                name='meetingDate'
                                label='Date'
                                type='date'
                                defaultValue={meetingData.meeting_date || ''}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row md:space-x-4'>
                        <div className='flex-1'>
                            <FormInput
                                name='supportContact'
                                label={
                                    meetingData.meeting_type === 'Lesson'
                                        ? 'Teacher'
                                        : 'Guest'
                                }
                                type='string'
                                required={false}
                                defaultValue={meetingData.support_contact || ''}
                            />
                        </div>
                        <div className='flex-1'>
                            <label>Type</label>
                            <select
                                className='w-full p-2 border rounded'
                                name='meetingType'
                                value={meetingData.meeting_type}
                                onChange={(e) =>
                                    setMeetingData({
                                        ...meetingData,
                                        meeting_type: e.target.value,
                                    })
                                }
                            >
                                <option value=''>Select Type</option>
                                {MEETING_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row md:space-x-4'>
                        <div className='flex-1'>
                            <FormInput
                                name='meal'
                                required={false}
                                label='Meal'
                                type='string'
                                defaultValue={meetingData.meal || ''}
                                placeholder='e.g. Pizza'
                            />
                        </div>
                        <div className='flex-1'>
                            <FormInput
                                name='mealContact'
                                required={false}
                                label='Meal Contact'
                                type='string'
                                defaultValue={meetingData.meal_contact || ''}
                                placeholder='who provides the meal'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row md:space-x-4'>
                        <div className='flex-1'>
                            <FormInput
                                name='mealCount'
                                label='Meal Count'
                                type='number'
                                defaultValue={meetingData.meal_count || '0'}
                            />
                        </div>
                        <div className='flex-1'>
                            <FormInput
                                name='attendanceCount'
                                label='Attendance'
                                type='number'
                                defaultValue={
                                    meetingData.attendance_count || '0'
                                }
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <FormInput
                            name='notes'
                            required={false}
                            label='Notes'
                            type='string'
                            defaultValue={meetingData.notes || ''}
                        />
                    </div>
                </div>

                <div className='mt-4'>
                    <Button type='submit'>Next: Define Groups</Button>
                </div>
            </FormContainer>
        );
    }

    return (
        <div className='space-y-6'>
            <FormContainer
                onSubmit={handleAddGroup}
                className='bg-gray-200 dark:bg-gray-600 p-6 rounded-lg border border-gray-300 dark:border-gray-500 shadow-sm'
            >
                <h2 className='text-2xl font-bold mb-4'>Add Groups</h2>
                <div className='flex flex-col space-y-4'>
                    <div className='flex flex-col md:flex-row md:space-x-4'>
                        <div className='flex-1'>
                            <FormInput
                                label='Group Name'
                                defaultValue={currentGroup.title || ''}
                                name={'title'}
                                type={'string'}
                            />
                        </div>
                        <div className='flex-1'>
                            <FormInput
                                label='Gender'
                                defaultValue={currentGroup.gender}
                                name={'gender'}
                                type={''}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row md:space-x-4'>
                        <div className='flex-1'>
                            <FormInput
                                label='Attendance'
                                type='number'
                                defaultValue={
                                    currentGroup.attendance?.toString() || '0'
                                }
                                name={'attendance'}
                            />
                        </div>
                        <div className='flex-1'>
                            {/* Placeholder for symmetry - could add another field here */}
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <Button type='submit'>Add Group</Button>
                </div>
            </FormContainer>

            <div className='mt-4'>
                <h3 className='text-xl font-bold mb-2'>Added Groups:</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {groups.map((group, index) => (
                        <div
                            key={index}
                            className='p-4 border rounded-lg bg-white dark:bg-gray-700'
                        >
                            {group.title} - {group.gender} - Attendance:{' '}
                            {group.attendance}
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-4 flex gap-2'>
                <Button onClick={() => setStep(1)} variant='outline'>
                    Back to Meeting Details
                </Button>
                <Button
                    onClick={handleFinalSubmit}
                    disabled={groups.length === 0}
                >
                    Save Meeting
                </Button>
            </div>
        </div>
    );
};

export default NewMeetingForm;
