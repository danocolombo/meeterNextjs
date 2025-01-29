'use client';
import React, { useState } from 'react';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { Button } from '@/components/ui/button';
import { MeetingType, GroupType } from '@/utils/types';
import { MEETING_TYPES, GROUP_LOCATIONS } from '@/utils/constants';

const NewMeetingForm = () => {
    const [step, setStep] = useState(1);
    const [meetingData, setMeetingData] = useState<MeetingType>({
        name: '',
        meeting_date: '',
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

    const handleMeetingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
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

    if (step === 1) {
        return (
            <FormContainer onSubmit={handleMeetingSubmit}>
                <h2 className='text-2xl font-bold mb-4'>New Meeting Details</h2>
                <FormInput
                    label='Title'
                    value={meetingData.name}
                    onChange={(e) =>
                        setMeetingData({ ...meetingData, name: e.target.value })
                    }
                />
                <FormInput
                    label='Date'
                    type='date'
                    value={meetingData.date}
                    onChange={(e) =>
                        setMeetingData({ ...meetingData, date: e.target.value })
                    }
                />
                <div className='space-y-2'>
                    <label>Type</label>
                    <select
                        className='w-full p-2 border rounded'
                        value={meetingData.type}
                        onChange={(e) =>
                            setMeetingData({
                                ...meetingData,
                                type: e.target.value,
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

                <Button type='submit'>Next: Define Groups</Button>
            </FormContainer>
        );
    }

    return (
        <div>
            <FormContainer onSubmit={handleAddGroup}>
                <h2 className='text-2xl font-bold mb-4'>Add Groups</h2>
                <FormInput
                    label='Group Name'
                    value={currentGroup.name}
                    onChange={(e) =>
                        setCurrentGroup({
                            ...currentGroup,
                            name: e.target.value,
                        })
                    }
                />
                <FormInput
                    label='Gender'
                    value={currentGroup.gender}
                    onChange={(e) =>
                        setCurrentGroup({
                            ...currentGroup,
                            gender: e.target.value,
                        })
                    }
                />
                <FormInput
                    label='Attendance'
                    type='number'
                    value={currentGroup.attendance}
                    onChange={(e) =>
                        setCurrentGroup({
                            ...currentGroup,
                            attendance: Number(e.target.value),
                        })
                    }
                />
                <FormInput
                    label='Offering'
                    type='number'
                    value={currentGroup.offering}
                    onChange={(e) =>
                        setCurrentGroup({
                            ...currentGroup,
                            offering: Number(e.target.value),
                        })
                    }
                />
                <Button type='submit'>Add Group</Button>
            </FormContainer>

            <div className='mt-4'>
                <h3 className='text-xl font-bold mb-2'>Added Groups:</h3>
                {groups.map((group, index) => (
                    <div key={index} className='p-2 border mb-2'>
                        {group.name} - {group.gender} - Attendance:{' '}
                        {group.attendance}
                    </div>
                ))}
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
