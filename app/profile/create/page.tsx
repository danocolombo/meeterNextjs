import React from 'react';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createProfileAction, checkJerichoUser } from '@/utils/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { JerichoUserType } from '@/utils/types';
import { fetchJerichoUser } from '@/providers/users';
import { SubmitButton } from '@/components/form/Buttons';

const CreateProfilePage = async () => {
    //* ---------------------------------
    //* get Clerk user data
    //* ---------------------------------
    const user = await currentUser();
    // console.log('user', user);
    //* -------------------------------------------
    //* check if privateMetadata has meeter defs
    //* -------------------------------------------
    // if the user has created a profile, redirect them to the home page
    if (user?.privateMetadata.hasProfile) {
        //* do not allow create profile if
        //* user has already created one
        redirect('/');
    }
    //* -------------------------------------------
    //* still here, need to check if there is Jericho
    //* record for this user (MySQL).
    //* -------------------------------------------
    const email: string = user!.emailAddresses[0].emailAddress;
    const jerichoUser: JerichoUserType | any = await fetchJerichoUser(email);
    console.log('PCP:34--> jerichoUser:\n', jerichoUser);
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>
                {jerichoUser.username ? 'Confirm Profile' : 'Create Profile'}
            </h1>
            <div className='border p-8 rounded-md'>
                <FormContainer
                    action={createProfileAction}
                    jerichoUser={jerichoUser}
                >
                    <div className='grid md:grid-cols-2 gap-4'>
                        <FormInput
                            label='First Name'
                            name='firstName'
                            defaultValue={jerichoUser.first_name}
                            readOnly={jerichoUser.first_name ? true : false}
                            type='text'
                        />
                        <FormInput
                            label='Last Name'
                            name='lastName'
                            defaultValue={jerichoUser.last_name}
                            readOnly={jerichoUser.last_name ? true : false}
                            type='text'
                        />
                        <FormInput
                            label='Username'
                            name='username'
                            defaultValue={jerichoUser.username}
                            readOnly={jerichoUser.username ? true : false}
                            type='text'
                        />
                    </div>

                    <SubmitButton
                        text={
                            jerichoUser.username ? 'Continue' : 'Create Profile'
                        }
                        className='mt-8'
                    />
                </FormContainer>
            </div>
        </section>
    );
};
export default CreateProfilePage;
