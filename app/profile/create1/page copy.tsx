import React from 'react';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createProfileAction } from '@/utils/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/form/Buttons';

async function CreateProfilePage() {
    const user = await currentUser();
    // if the user has created a profile, redirect them to the home page
    if (user?.privateMetadata.hasProfile) {
        redirect('/');
    }
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
            <div className='border p-8 rounded-md'>
                <FormContainer action={createProfileAction}>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <FormInput
                            label='First Name'
                            name='firstName'
                            type='text'
                        />
                        <FormInput
                            label='Last Name'
                            name='lastName'
                            type='text'
                        />
                        <FormInput
                            label='Username'
                            name='username'
                            type='text'
                        />
                    </div>

                    <SubmitButton text='Create Profile' className='mt-8' />
                </FormContainer>
            </div>
        </section>
    );
}
export default CreateProfilePage;
