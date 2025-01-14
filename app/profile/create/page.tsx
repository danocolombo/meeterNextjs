'use client';
// import { currentUser } from '@clerk/nextjs/server';
import { useUser, useAuth } from '@clerk/clerk-react';


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
    // const auth = useAuth();
    // console.log('PCP:29--> auth:\n', auth);
    // const useUserResponse = useUser();
    // console.log('PCP:31--> useUserResponse:\n', useUserResponse);
    const { isSignedIn, userId, isLoaded } = await useAuth();
    console.log('PCP:31--> isSignedIn:\n', isSignedIn);
    console.log('PCP:32--> userId:\n', userId);
    console.log('PCP:33--> isLoaded:\n', isLoaded);

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
