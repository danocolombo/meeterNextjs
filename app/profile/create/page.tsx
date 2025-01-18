import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { checkJerichoUser } from '@/utils/actions';
import { createProfileAction } from '@/utils/clerk';
import { useToast } from '@/hooks/use-toast';
import { JerichoUserType } from '@/utils/types';
import { fetchJerichoUser } from '@/providers/users';
import { SubmitButton } from '@/components/form/Buttons';
import axios from 'axios';
import { SessionPayloadType } from '@/utils/types';

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
export default async function CreateProfilePage() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    //* ---------------------------------
    //* get Clerk user data
    //* ---------------------------------
    const user: any = await currentUser();
    // console.log('clerk_current_user\n', user);
    const primaryEmailAddressId = user?.primaryEmailAddressId;
    const clerkPrimaryEmailAddress = await user?.emailAddresses.find(
        (email: any) => {
            return email.id === primaryEmailAddressId;
        }
    );
    let variables: SessionPayloadType = {
        clerkId: user?.id || '0',
        userEmail: clerkPrimaryEmailAddress?.emailAddress || '',
        orgId: user?.privateMetadata?.organization?.id || null,
        orgCode: user?.privateMetadata?.organization?.code || null,
        orgName: user?.privateMetadata?.organization?.name || null,
        orgRole: user?.privateMetadata?.organization?.role || null,
        expiresAt: new Date(),
    };
    // console.log('PCP:26--> variables:\n', variables);

    //* ---------------------------------
    //* clerk private meta data
    //* ---------------------------------
    // const metaResponse = await fetch(
    //     new URL(`/api/users/meta/${user.userId}`, baseUrl),
    //     {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //     }
    // );
    // // const showMeta = await metaResponse.json();
    // console.log('POST metaResponse payload:', metaResponse);

    //* ---------------------------------
    //* get APITOKEN from Jericho
    //* ---------------------------------
    const authRequest = {
        id: user?.id,
        email: clerkPrimaryEmailAddress.emailAddress,
    };
    const authResponse = await fetch(new URL('/api/apitoken/login', baseUrl), {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authRequest),
    });
    const showIt = await authResponse.json();
    // console.log('----------------------------------------------------');
    console.log('APC:89--API token information:', showIt);
    console.log('###\n', showIt.apiToken.plainTextToken, '\n###');
    //todo: ___________________________________________
    //todo: NEED TO CHECK IF showIt.status !== 200
    //todo: ___________________________________________

    //* ---------------------------------
    //* save apiToken to session variable
    //* ---------------------------------
    console.log('APC:93++++++++++++++++++++++++++++++++++++++++++++++++++++');
    const testResults = await fetch(new URL(`/api/users/meta`, baseUrl), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });
    const showTest = await testResults.json();
    console.log('APC:101--showTest:\n', showTest);

    const postResults = await fetch(new URL(`/api/users/meta`, baseUrl), {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: JSON.stringify({ api_token: showIt.apiToken.plainTextToken }),
    });
    const showPOSTresponse = await postResults.json();
    console.log('APC:113--showPOSTresponse:\n', showPOSTresponse);

    return <div>CreateProfilePage</div>;
}
