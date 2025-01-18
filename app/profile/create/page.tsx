import { currentUser } from '@clerk/nextjs/server';

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
    //* get APITOKEN from Jericho
    //* ---------------------------------
    const authRequest = {
        id: user?.id,
        email: clerkPrimaryEmailAddress.emailAddress,
    };
    const apiAuthResponse = await fetch(
        new URL('/api/apitoken/login', baseUrl),
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authRequest),
        }
    );
    const apiAuth = await apiAuthResponse.json();
    console.log('APC:61--apiAuth information:', apiAuth);
    //todo: ___________________________________________
    //todo: NEED TO CHECK IF apiAuth.status !== 200
    //todo: ___________________________________________

    //* ---------------------------------
    //* save apiToken to session variable
    //* ---------------------------------
    console.log('APC:69++++++++++++++++++++++++++++++++++++++++++++++++++++');
    const getTestResults = await fetch(new URL(`/api/users/meta`, baseUrl), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });
    const getResults = await getTestResults.json();
    console.log('APC:77--getResults:\n', getResults);

    const postTestResults = await fetch(new URL(`/api/users/meta`, baseUrl), {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: JSON.stringify({
            api_token: apiAuth.apiToken.plainTextToken,
        }),
    });
    const postResults = await postTestResults.json();
    console.log('APC:89--postResults:\n', postResults);

    return <div>CreateProfilePage</div>;
}
