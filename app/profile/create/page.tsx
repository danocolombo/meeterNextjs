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
export default async function CreateProfilePage() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

    const res = await fetch(new URL('/api/session', baseUrl), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });
    const data = await res.json();
    console.log('Response payload:', data);
    //Server side rendering
    // const user = await currentUser();
    // const { isSignedIn, user, isLoaded } = await useUser();
    // console.log('PCP:27--> isSignedIn:\n', isSignedIn);
    // console.log('PCP:28--> user:\n', user);
    // console.log('PCP:29--> isLoaded:\n', isLoaded);
    // const userInfo = await useUser();
    // console.log('PCP:30--> userInfo:\n', userInfo);

    // const primaryEmailAddressId = user?.primaryEmailAddressId;
    // const clerkPrimaryEmailAddress = await user?.emailAddresses.find(
    //     (email) => {
    //         return email.id === primaryEmailAddressId;
    //     }
    // );
    // let variables: SessionPayloadType = {
    //     clerkId: user?.id,
    //     cognitoSub: user?.privateMetadata.cognitoSub,
    //     userEmail: clerkPrimaryEmailAddress.emailAddress,
    //     orgId: user?.privateMetadata.organization.id,
    //     orgCode: user?.privateMetadata.organization.code,
    //     orgName: user?.privateMetadata.organization.name,
    //     orgRole: user?.privateMetadata.organization.role,
    //     expiresAt: new Date(),
    // };
    // console.log('PCP:26--> SessionPayload object:\n', variables);
    // const jerichoUser = await fetch(`/api/users/${variables?.cognitoSub}`, {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //     },
    // });
    // const res = await getAuthUser();

    // console.log('PCP:46--> res:\n', res);

    return <div>CreateProfilePage</div>;
}
