'use client';
import { useState } from 'react';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { handleMeetingSubmit } from '@/app/actions/meetingActions';
import { Card } from '@/components/ui/card';

function CreateMeetingPage() {
    const [groups, setGroups] = useState([
        { title: '', location: '', facilitator: '' },
    ]);

    const addGroup = () => {
        setGroups([...groups, { title: '', location: '', facilitator: '' }]);
    };

    const handleGroupChange = (index: number, field: string, value: string) => {
        const newGroups = [...groups];
        newGroups[index][field] = value;
        setGroups(newGroups);
    };

    return (
        <div>
            <section className='w-3/4'>
                <h1 className='text-2xl font-semibold mb-8 capitalize'>
                    Create Meeting
                </h1>
                <FormContainer action={handleMeetingSubmit}>
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <FormInput
                            name='title'
                            type='text'
                            label='Title'
                            defaultValue=''
                            placeholder='Meeting Title'
                        />
                        <FormInput
                            name='meeting_date'
                            type='date'
                            label='Meeting Date'
                            defaultValue=''
                            placeholder='Meeting Date'
                        />
                        <FormInput
                            name='meeting_type'
                            type='text'
                            label='Meeting Type'
                            defaultValue=''
                            placeholder='Meeting Type'
                        />
                        <FormInput
                            name='attendance_count'
                            type='number'
                            label='Attendance Count'
                            defaultValue=''
                            placeholder='Attendance Count'
                        />
                        <FormInput
                            name='facilitator_contact'
                            type='text'
                            label='Facilitator Contact'
                            defaultValue=''
                            placeholder='Facilitator Contact'
                        />
                        <FormInput
                            name='support_contact'
                            type='text'
                            label='Support Contact'
                            defaultValue=''
                            placeholder='Support Contact'
                        />
                        <FormInput
                            name='meal'
                            type='text'
                            label='Meal'
                            defaultValue=''
                            placeholder='Meal'
                        />
                        <FormInput
                            name='meal_contact'
                            type='text'
                            label='Meal Contact'
                            defaultValue=''
                            placeholder='Meal Contact'
                        />
                        <FormInput
                            name='meal_count'
                            type='number'
                            label='Meal Count'
                            defaultValue=''
                            placeholder='Meal Count'
                        />
                        <FormInput
                            name='notes'
                            type='text'
                            label='Notes'
                            defaultValue=''
                            placeholder='Notes'
                        />
                    </div>
                    <Card className='p-4 border-4 border-slate-700'>
                        <h2 className='text-lg font-semibold mb-4'>Groups</h2>
                        {groups.map((group, index) => (
                            <div key={index} className='mb-4'>
                                <FormInput
                                    name={`group_title_${index}`}
                                    type='text'
                                    label='Group Title'
                                    defaultValue={group.title}
                                    placeholder='Group Title'
                                    onChange={(e) =>
                                        handleGroupChange(
                                            index,
                                            'title',
                                            e.target.value
                                        )
                                    }
                                />
                                <FormInput
                                    name={`group_location_${index}`}
                                    type='text'
                                    label='Group Location'
                                    defaultValue={group.location}
                                    placeholder='Group Location'
                                    onChange={(e) =>
                                        handleGroupChange(
                                            index,
                                            'location',
                                            e.target.value
                                        )
                                    }
                                />
                                <FormInput
                                    name={`group_facilitator_${index}`}
                                    type='text'
                                    label='Group Facilitator'
                                    defaultValue={group.facilitator}
                                    placeholder='Group Facilitator'
                                    onChange={(e) =>
                                        handleGroupChange(
                                            index,
                                            'facilitator',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addGroup}
                            className='mt-2 p-2 bg-blue-500 text-white rounded'
                        >
                            Add Group
                        </button>
                    </Card>
                    <SubmitButton text='Save Meeting' className='mt-5' />
                </FormContainer>
            </section>
        </div>
    );
}

export default CreateMeetingPage;
