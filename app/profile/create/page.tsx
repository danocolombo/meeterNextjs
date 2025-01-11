import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createProfileAction, checkJerichoUser } from '@/utils/actions';
import { useToast } from '@/hooks/use-toast';
import { JerichoUserType } from '@/utils/types';
import { fetchJerichoUser } from '@/providers/users';
import { SubmitButton } from '@/components/form/Buttons';
import axios from 'axios';
import { SessionPayloadType } from '@/types/types';

/*
userId: string;
    clerkId: string;
    username?: string;
    userEmail?: string;
    jerichoId?: string;
    cognitoSub?: string;
    meeterUserRole?: string;
    orgId?: string;
    orgCode?: string;
    orgName?: string;
    orgRole?: string;
    cognitoToken?: string;
    jerichoToken?: string;
    expiresAt?: Date;
*/
const CreateProfilePage = async (props: any) => {
    //* ---------------------------------
    //* get Clerk user data
    //* ---------------------------------
    const user = await currentUser();
    // console.log('clerk_current_user\n', user);
    const primaryEmailAddressId = user?.primaryEmailAddressId;
    const clerkPrimaryEmailAddress = await user?.emailAddresses.find(
        (email) => {
            return email.id === primaryEmailAddressId;
        }
    );
    let variables: SessionPayloadType = {
        clerkId: user?.id,
        userEmail: clerkPrimaryEmailAddress.emailAddress,
        orgId: user?.privateMetadata.organization.id,
        orgCode: user?.privateMetadata.organization.code,
        orgName: user?.privateMetadata.organization.name,
        orgRole: user?.privateMetadata.organization.role,
        expiresAt: new Date(),
    };
    console.log('PCP:26--> variables:\n', variables);
    //* -------------------------------------------
    //* login to cognito
    //* -------------------------------------------

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

    const sessionInput = { token: '1234567890' };
    try {
        const res = await fetch('http://localhost:3000/api/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(sessionInput),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const jsonData = await res.json();
        console.log(jsonData);
    } catch (error: any) {
        console.error(error);
    }
    // try {
    //     const response = await axios.post('/api/users/login', user);

    //     console.log('Session created:', response.data);
    // } catch (error) {
    //     console.error('Error creating session:', error);
    // }

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
