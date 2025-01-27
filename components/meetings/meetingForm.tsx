import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import { MeetingType } from '@/app/meetings/[id]/page';
import { handleMeetingSubmit } from '@/app/actions/meetingActions';

export default function MeetingForm({ meeting }: { meeting: MeetingType }) {
    return (
        <div className='form-container'>
            <FormContainer action={handleMeetingSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
                    <div className='form-group'>
                        <FormInput
                            name='title'
                            type='text'
                            defaultValue={meeting.title || ''}
                            className='form-input'
                            label='Title'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='meeting_date'
                            type='date'
                            defaultValue={meeting.meeting_date || ''}
                            className='form-input'
                            label='Meeting Date'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='meeting_type'
                            type='text'
                            defaultValue={meeting.meeting_type || ''}
                            className='form-input'
                            label='Meeting Type'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='attendance_count'
                            type='number'
                            defaultValue={meeting.attendance_count?.toString()}
                            className='form-input'
                            label='Attendance Count'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='facilitator_contact'
                            type='text'
                            defaultValue={meeting.facilitator_contact || ''}
                            className='form-input'
                            label='Facilitator Contact'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='support_contact'
                            type='text'
                            defaultValue={meeting.support_contact || ''}
                            className='form-input'
                            label='Support Contact'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='meal'
                            type='text'
                            defaultValue={meeting.meal || ''}
                            className='form-input'
                            label='Meal'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='meal_contact'
                            type='text'
                            defaultValue={meeting.meal_contact || ''}
                            className='form-input'
                            label='Meal Contact'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='meal_count'
                            type='number'
                            defaultValue={meeting.meal_count?.toString()}
                            className='form-input'
                            label='Meal Count'
                            labelClassName='form-label'
                        />
                    </div>
                    <div className='form-group'>
                        <FormInput
                            name='notes'
                            type='text'
                            defaultValue={meeting.notes || ''}
                            className='form-input'
                            label='Notes'
                            labelClassName='form-label'
                        />
                    </div>
                </div>
            </FormContainer>
        </div>
    );
}
