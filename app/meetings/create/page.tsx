import { SubmitButton } from '@/components/form/Buttons';
import CounterInput from '@/components/form/CounterInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import MeetingTypeSelectInput from '@/components/form/MeetingTypeSelectInput';
import NumberInput from '@/components/form/NumberInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { Card } from '@/components/ui/card';
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
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <FormInput
                            name='worship'
                            type='text'
                            label='Music/Worship (20 limit)'
                            defaultValue='Videos'
                        />
                    </div>
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <Card className='p-4 border-4 border-slate-700'>
                            <h2 className='text-lg font-semibold mb-4'>
                                Meal Info
                            </h2>
                            <FormInput
                                name='meal'
                                type='text'
                                label='menu (20 limit)'
                                defaultValue=''
                            />
                            <FormInput
                                name='meal_contact'
                                type='text'
                                label='menu (20 limit)'
                                defaultValue=''
                            />
                            <div className='flex items-center gap-4'>
                                <p>People Served</p>
                                <NumberInput reference='meal_count' />
                            </div>
                        </Card>
                        <div>
                            <Card className='p-4 border-4 border-slate-700'>
                                <h2 className='text-lg font-semibold mb-4'>
                                    Attendees
                                </h2>

                                <div className='flex items-center justify-between gap-4'>
                                    <p>General Meeting</p>
                                    <NumberInput reference='attendance_count' />
                                </div>
                                <div className='flex items-center justify-between gap-4'>
                                    <p>Newcomers</p>
                                    <NumberInput reference='newcomers_count' />
                                </div>
                            </Card>
                            <div className='mt-4'>
                                <TextAreaInput
                                    name='notes'
                                    labelText='Notes (50 limit)'
                                    defaultValue='What happened...'
                                    height={3}
                                />
                            </div>
                        </div>
                    </div>
                    {/* text area / description */}
                    <SubmitButton text='create meeting' className='mt-5' />
                </FormContainer>
            </section>
        </div>
    );
}

export default CreateMeetingPage;
