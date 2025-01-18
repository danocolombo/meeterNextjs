import { currentUser } from '@clerk/nextjs/server';

import { UserProfileType } from '@/utils/types';

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
    const clerkCurrentUser: any = await currentUser();
    // console.log('APC:27--clerkCurrentUser:\n', clerkCurrentUser);
    const primaryEmailAddressId = clerkCurrentUser?.primaryEmailAddressId;
    const clerkPrimaryEmailAddress =
        await clerkCurrentUser?.emailAddresses.find((email: any) => {
            return email.id === primaryEmailAddressId;
        });

    //* ---------------------------------
    //* get APITOKEN from Jericho
    //* ---------------------------------
    const authRequest = {
        id: clerkCurrentUser?.id,
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

    // console.log('APC:64--apiAuth information:', apiAuth);
    //todo: ___________________________________________
    //todo: NEED TO CHECK IF apiAuth.status !== 200
    //todo: ___________________________________________

    //* ---------------------------------
    //* save apiToken to session variable
    //* ---------------------------------
    const postUserMetaResults = await fetch(
        new URL(`/api/users/meta`, baseUrl),
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                apiToken: apiAuth.apiToken.plainTextToken,
                clerkId: clerkCurrentUser?.id,
            }),
        }
    );
    const userMetaResponse: any = await postUserMetaResults.json();
    if (userMetaResponse.status !== 200) {
        console.log('userMetaResponse:', userMetaResponse);
        console.log('APC:77--ERROR postUserMetaResults !== 200 [apc:77]');
    }
    const userMeta = await userMetaResponse.privateMetadata;
    console.log('APC:81--userMeta:\n', userMeta);

    //* ---------------------------------
    //* get Jericho user profile
    //* ---------------------------------
    const jerichoUserProfile = await fetch(
        new URL(`/api/users/${userMeta.jerichoId}`, baseUrl),
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                apiToken: apiAuth.apiToken.plainTextToken,
            }),
        }
    );
    const jerichoUserResults = await jerichoUserProfile.json();
    if (jerichoUserResults.status !== 200) {
        console.log('jerichoUserResults:', jerichoUserResults);
        console.log('APC:101--ERROR jerichoUserResults !== 200 [apc:101]');
    }
    // console.log('APC:96--jerichoUserResults:\n', jerichoUserResults);
    const userProfile = jerichoUserResults.data;
    console.log('APC:105-->userProfile:\n', userProfile);
    let profile: UserProfileType = {
        clerkId: clerkCurrentUser?.id || '0',
        jerichoId: userProfile?.id || '0',
        jerichoSub: userProfile?.cognito_sub || '0',
        username: userProfile?.username || '',
        firstName: userProfile?.first_name || '',
        lastName: userProfile?.last_name || '',
        email: userProfile?.email || userMeta.email || '',
        defaultOrgId: userProfile?.default_org_id || null,
        orgId: null,
        orgCode: null,
        orgName: null,
        orgRole: null,
        asOf: new Date(),
    };
    console.log('PCP:107--> profile:\n', profile);

    //todo: ___________________________________________
    //todo: THESE ARE JUST TWO GET EXAMPLES THAT DO
    //todo: NOTHING, REMOVE B4 PROD
    //todo: ___________________________________________

    // console.log('APC:89++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // const getTestResults = await fetch(new URL(`/api/users/meta`, baseUrl), {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //     },
    // });
    // const getResults = await getTestResults.json();
    // console.log('APC:97--getResults:\n', getResults);

    // const testStatus = 'active';
    // const testCID = '435n43ij399';
    // console.log('APC:101++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // const getQueryTestResults = await fetch(
    //     new URL(`/api/users/meta?status=${testStatus}&cid=${testCID}`, baseUrl),
    //     {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //         },
    //     }
    // );
    // const getQueryResults = await getQueryTestResults.json();
    // console.log('APC:109--getQueryResults:\n', getQueryResults);

    return <div>CreateProfilePage</div>;
}
