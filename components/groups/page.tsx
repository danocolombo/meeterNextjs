import React from 'react';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import { GroupType } from '@/app/meetings/[id]/page';
import { handleGroupSubmit } from '@/app/actions/meetingActions';

interface GroupsComponentProps {
    group: GroupType;
    isNew?: boolean;
}

const GroupsComponent = ({ group, isNew }: GroupsComponentProps) => {
    return (
        <div
            className={`p-4 rounded-lg border ${
                isNew
                    ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-50'
                    : 'bg-[hsl(var(--form-background))] text-[hsl(var(--form-text))]'
            }`}
        >
            <FormContainer action={handleGroupSubmit}>
                <div className='text-2xl font-bold text-blue-800 dark:text-blue-400'>
                    Group
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg'>
                    <FormInput
                        name='title'
                        type='text'
                        className='form-input'
                        defaultValue={group.title || ''}
                        label='Title'
                    />
                    <FormInput
                        name='location'
                        type='text'
                        defaultValue={group.location || ''}
                        label='Location'
                    />
                    <FormInput
                        name='gender'
                        type='text'
                        defaultValue={group.gender || ''}
                        label='Gender'
                    />
                    <FormInput
                        name='attendance'
                        type='number'
                        defaultValue={group.attendance?.toString()}
                        label='Attendance'
                    />
                    <FormInput
                        name='facilitator'
                        type='text'
                        defaultValue={group.facilitator || ''}
                        label='Facilitator'
                    />
                    <FormInput
                        name='cofacilitator'
                        type='text'
                        defaultValue={group.cofacilitator || ''}
                        label='Co-facilitator'
                    />
                    <div className='md:col-span-2'>
                        <FormInput
                            name='notes'
                            type='text'
                            defaultValue={group.notes || ''}
                            label='Notes'
                        />
                    </div>
                </div>
            </FormContainer>
        </div>
    );
};

export default GroupsComponent;
