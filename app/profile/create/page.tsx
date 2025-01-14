'use client';
// import { currentUser } from '@clerk/nextjs/server';
import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { SessionPayloadType } from '@/types/types';
import { getAuthUser } from '@/utils/jericho';
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
async function CreateProfilePage() {
    //Server side rendering
    // const user = await currentUser();
    const { isSignedIn, user, isLoaded } = await useUser();
    console.log('PCP:27--> isSignedIn:\n', isSignedIn);
    console.log('PCP:28--> user:\n', user);
    console.log('PCP:29--> isLoaded:\n', isLoaded);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(new URL('/api/test', baseUrl), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });
    const data = await res.json();
    console.log('Response payload:', data);
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

export default CreateProfilePage;
