import { SubmitButton } from '@/components/form/Buttons';
import CounterInput from '@/components/form/CounterInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import MeetingTypeSelectInput from '@/components/form/MeetingTypeSelectInput';
import NumberInput from '@/components/form/NumberInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { Card } from '@/components/ui/card';
import { createMeetingAction, createPropertyAction } from '@/utils/actions';
import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
function CreateMeetingPage() {
    return (
        <div>
            <section className='w-3/4'>
                <h1 className='text-2xl font-semibold mb-8 capitalize'>
                    Create Meeting
                </h1>
                <FormContainer action={createMeetingAction}>
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <FormInput
                            name='title'
                            type='text'
                            label='Title (20 limit)'
                            defaultValue=''
                            placeholder='Meeting Title'
                        />
                        <MeetingTypeSelectInput />
                    </div>
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <div></div>
                        <FormInput
                            name='support_contact'
                            type='text'
                            label='Who (20 limit)'
                            defaultValue=''
                            placeholder='Who?'
                            required={false}
                        />
                    </div>

                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <FormInput
                            name='worship'
                            type='text'
                            label='Music/Worship (20 limit)'
                            placeholder='Videos'
                            required={false}
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
                                placeholder="What's for dinner?"
                                required={false}
                            />
                            <FormInput
                                name='meal_contact'
                                type='text'
                                label='menu (20 limit)'
                                defaultValue=''
                                placeholder='Who provided the food?'
                                required={false}
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
                                    defaultValue=''
                                    height={3}
                                    placeholder='How did it go?'
                                    required={false}
                                />
                            </div>
                        </div>
                    </div>
                    <SubmitButton text='create meeting' className='mt-5' />
                </FormContainer>
            </section>
        </div>
    );
}

export default CreateMeetingPage;
