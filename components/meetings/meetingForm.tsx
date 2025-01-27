import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import { MeetingType } from '@/app/meetings/[id]/page';
import { handleMeetingSubmit } from '@/app/actions/meetingActions';

export default function MeetingForm({ meeting }: { meeting: MeetingType }) {
    return (
        <FormContainer action={handleMeetingSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormInput
                    name='title'
                    type='text'
                    defaultValue={meeting.title || ''}
                />
                <FormInput
                    name='meeting_date'
                    type='date'
                    defaultValue={meeting.meeting_date || ''}
                />
                <FormInput
                    name='meeting_type'
                    type='text'
                    defaultValue={meeting.meeting_type || ''}
                />
                <FormInput
                    name='attendance_count'
                    type='number'
                    defaultValue={meeting.attendance_count?.toString()}
                />
                <FormInput
                    name='facilitator_contact'
                    type='text'
                    defaultValue={meeting.facilitator_contact || ''}
                />
                <FormInput
                    name='support_contact'
                    type='text'
                    defaultValue={meeting.support_contact || ''}
                />
                <FormInput
                    name='meal'
                    type='text'
                    defaultValue={meeting.meal || ''}
                />
                <FormInput
                    name='meal_contact'
                    type='text'
                    defaultValue={meeting.meal_contact || ''}
                />
                <FormInput
                    name='meal_count'
                    type='number'
                    defaultValue={meeting.meal_count?.toString()}
                />
                <FormInput
                    name='notes'
                    type='text'
                    defaultValue={meeting.notes || ''}
                />
            </div>
        </FormContainer>
    );
}
