import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import MeetingTypeSelectInput from '@/components/form/MeetingTypeSelectInput';
import { createPropertyAction } from '@/utils/actions';
import React from 'react';

function CreateMeetingPage() {
    return (
        <div>
            <section className='w-3/4'>
                <h1 className='text-2xl font-semibold mb-8 capitalize'>
                    Create Meeting
                </h1>
                <FormContainer action={createPropertyAction}>
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <FormInput
                            name='title'
                            type='text'
                            label='Title (20 limit)'
                            defaultValue='Weekly Meeting'
                        />
                        <MeetingTypeSelectInput />
                    </div>
                    {/* text area / description */}
                    <SubmitButton text='create meeting' className='mt-12' />
                </FormContainer>
            </section>
        </div>
    );
}

export default CreateMeetingPage;
