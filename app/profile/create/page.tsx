import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserProfileType } from '@/utils/types';
import { printObject } from '@/utils/helpers';
import axios from 'axios';

export default async function CreateProfilePage() {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        //* ---------------------------------
        //* get Clerk user data
        //* ---------------------------------
        const clerkCurrentUser: any = await currentUser();
        //* ------------------------------------------------
        //* if status is not active, send to register page
        //* ------------------------------------------------
        if (clerkCurrentUser?.privateMetadata?.status !== 'active') {
            redirect('/register?message=Please complete registration');
            return null;
        }
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
        console.log('🤍🤍🤍 APCP:36-->baseUrl:\n', baseUrl);
        const apiAuthResponse = await axios.post(
            new URL('/api/apitoken/login', baseUrl).toString(),
            authRequest,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        if (apiAuthResponse.status !== 200) {
            throw new Error(
                `Authentication failed with status ${apiAuthResponse.status}`
            );
        }

        // Get the response data and apiToken
        const apiAuth = apiAuthResponse.data;
        const apiToken = apiAuth.apiToken;

        // Safe logging of relevant data only
        printObject('🥖🥖🥖APC:44--apiAuth Data:\n', {
            status: apiAuth.status,
            message: apiAuth.message,
            apiToken: apiAuth.apiToken,
        });

        //* ---------------------------------
        //* get Jericho user profile
        //* ---------------------------------
        const jerichoUserProfile = await fetch(
            new URL(
                `/api/users/${clerkCurrentUser?.privateMetadata?.jerichoId}`,
                baseUrl
            ),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    apiToken: apiToken, // Use the direct token string
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

        // console.log('APC:69--userProfile:\n', userProfile);
        //* =====================================================
        //* remove unnecessary data from userProfile
        //* =====================================================
        delete userProfile.created_at;
        delete userProfile.updated_at;
        delete userProfile.shirt;
        delete userProfile.aws_id;
        delete userProfile.aws_def_org_id;
        delete userProfile.aws_location_id;
        delete userProfile.forgot_password_token;
        delete userProfile.verify_token;
        delete userProfile.forgot_password_token_expiry;
        delete userProfile.verify_token_expiry;

        //* =====================================================
        //* need to get all the roles the user has for the
        //* default org, based on the affiliations array.
        //* =====================================================
        let roles: string[] = [];
        userProfile?.affiliations?.forEach((affiliation: any) => {
            if (affiliation.organization_id === userProfile.default_org_id) {
                if (affiliation.status === 'active') {
                    roles.push(affiliation.role);
                }
            }
        });
        // console.log('APC:118-->roles:\n', roles);
        const affiliations = userProfile.affiliations || [];
        // console.log('APC:105-->userProfile:\n', userProfile);
        let profile: UserProfileType = {
            clerkId: clerkCurrentUser?.id || '0',
            jerichoId: userProfile?.id || '0',
            jerichoSub: userProfile?.cognito_sub || '0',
            username: userProfile?.username || '',
            firstName: userProfile?.first_name || '',
            lastName: userProfile?.last_name || '',
            email: userProfile?.email || '',
            defaultOrgId: userProfile?.default_org_id || null,
            orgId: userProfile?.default_org?.id,
            orgCode: userProfile?.default_org?.code,
            orgName: userProfile?.default_org?.name,
            roles: roles,
            asOf: new Date(),
        };
        const sizeInBytes = Buffer.byteLength(JSON.stringify(userProfile));
        // console.log(`Size of userProfile in bytes: ${sizeInBytes}`);
        // console.log('PCP:150--> profile:\n', profile);

        //* ---------------------------------
        //* save apiToken to session variable
        //* ---------------------------------
        if (sizeInBytes < 8000) {
            const postUserMetaResults = await fetch(
                new URL(`/api/users/meta`, baseUrl),
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        apiToken: apiToken, // Use the direct token string
                        clerkId: clerkCurrentUser?.id,
                        status: 'active',
                        userProfile: profile,
                    }),
                }
            );
            const userMetaResponse: any = await postUserMetaResults.json();
            if (userMetaResponse.status !== 200) {
                console.log('userMetaResponse:', userMetaResponse);
                console.log(
                    'APC:77--ERROR postUserMetaResults !== 200 [apc:77]'
                );
            }
            const userMeta = await userMetaResponse.privateMetadata;
            console.log('😀😀😀 APCP:150-->apiAuth Data:\n', {
                status: apiAuth.status,
                message: apiAuth.message,
                apiToken: apiAuth.apiToken,
            });
            console.log('😀😀😀 APCP:151--userMeta:\n', userMeta);
        }
        console.log('😀😀😀 APCP:174--profile:\n', profile);

        // Simplified redirect logic
        if (profile && Object.keys(profile).length > 0) {
            redirect('/profile');
            return null;
        }

        // Fallback UI
        return <div>CreateProfilePage</div>;
    } catch (error: any) {
        console.error('Authentication failed:', error.message);
        redirect('/error?message=Authentication+failed');
        return null;
    }
}
