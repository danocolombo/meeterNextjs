import React from 'react';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import { GroupType } from '@/app/meetings/[id]/page';
import { handleGroupSubmit } from '@/app/actions/meetingActions';

const GroupsComponent = ({ group }: { group: GroupType }) => {
    return (
        <div className='form-container'>
            <FormContainer action={handleGroupSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg'>
                    <FormInput
                        name='title'
                        type='text'
                        className='form-input'
                        defaultValue={group.title || ''}
                    />
                    <FormInput
                        name='location'
                        type='text'
                        defaultValue={group.location || ''}
                    />
                    <FormInput
                        name='gender'
                        type='text'
                        defaultValue={group.gender || ''}
                    />
                    <FormInput
                        name='attendance'
                        type='number'
                        defaultValue={group.attendance?.toString()}
                    />
                    <FormInput
                        name='facilitator'
                        type='text'
                        defaultValue={group.facilitator || ''}
                    />
                    <FormInput
                        name='cofacilitator'
                        type='text'
                        defaultValue={group.cofacilitator || ''}
                    />
                    <FormInput
                        name='notes'
                        type='text'
                        defaultValue={group.notes || ''}
                    />
                </div>
            </FormContainer>
        </div>
    );
};

export default GroupsComponent;
