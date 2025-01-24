import React from 'react';
import { clerkClient } from '@clerk/nextjs/server';
import UserCard from '@/components/admin/userCard';
import { UserProfileType, ClerkUserType } from '@/utils/types';
import { printObject } from '@/utils/helpers';

const ShowUsersPage = async () => {
    const response = await clerkClient.users.getUserList();
    const oldUsersList = [
        {
            jericho_id: '1',
            created_at: '2021-08-04T16:00:00.000Z',
            cognito_sub: '12345',
            username: 'user1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'jdoe@gmail.com',
            default_org_id: '1',
        },
        {
            jericho_id: '2',
            created_at: '2021-09-04T16:00:00.000Z',
            cognito_sub: '67890',
            username: 'user2',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jsmith@gmail.com',
            default_org_id: '2',
        },
        {
            jericho_id: '3',
            created_at: '2021-10-04T16:00:00.000Z',
            cognito_sub: '54321',
            username: 'user3',
            first_name: 'Alice',
            last_name: 'Johnson',
            email: 'ajohnson@gmail.com',
            default_org_id: '3',
        },
        {
            jericho_id: '4',
            created_at: '2021-11-04T16:00:00.000Z',
            cognito_sub: '98765',
            username: 'user4',
            first_name: 'Bob',
            last_name: 'Brown',
            email: 'bbrown@gmail.com',
            default_org_id: '4',
        },
        {
            jericho_id: '5',
            created_at: '2021-12-04T16:00:00.000Z',
            cognito_sub: '11223',
            username: 'user5',
            first_name: 'Charlie',
            last_name: 'Davis',
            email: 'cdavis@gmail.com',
            default_org_id: '5',
        },
        {
            jericho_id: '6',
            created_at: '2022-01-04T16:00:00.000Z',
            cognito_sub: '44556',
            username: 'user6',
            first_name: 'David',
            last_name: 'Evans',
            email: 'devans@gmail.com',
            default_org_id: '6',
        },
        {
            jericho_id: '7',
            created_at: '2022-02-04T16:00:00.000Z',
            cognito_sub: '77889',
            username: 'user7',
            first_name: 'Eve',
            last_name: 'Frank',
            email: 'efrank@gmail.com',
            default_org_id: '7',
        },
        {
            jericho_id: '8',
            created_at: '2022-03-04T16:00:00.000Z',
            cognito_sub: '99000',
            username: 'user8',
            first_name: 'Frank',
            last_name: 'Green',
            email: 'fgreen@gmail.com',
            default_org_id: '8',
        },
        {
            jericho_id: '9',
            created_at: '2022-04-04T16:00:00.000Z',
            cognito_sub: '22334',
            username: 'user9',
            first_name: 'Grace',
            last_name: 'Hill',
            email: 'ghill@gmail.com',
            default_org_id: '9',
        },
        {
            jericho_id: '10',
            created_at: '2022-05-04T16:00:00.000Z',
            cognito_sub: '55667',
            username: 'user10',
            first_name: 'Hank',
            last_name: 'Ivy',
            email: 'hivy@gmail.com',
            default_org_id: '10',
        },
    ];
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const apiClerkUsersResponse: any = await fetch(
        `${baseUrl}/api/admin/clerk/users`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const clerkUsersList = await apiClerkUsersResponse.json();
    // printObject('AAU:123--clerkUsersList:\n', clerkUsersList);
    const users = clerkUsersList?.userList.data?.userList.data.map(
        (user: ClerkUserType) => {
            return {
                id: user?.id || '',
                passwordEnabled: user?.passwordEnabled || false,
                totpEnabled: user?.totpEnabled || false,
                backupCodeEnabled: user?.backupCodeEnabled || false,
                twoFactorEnabled: user?.twoFactorEnabled || false,
                banned: user?.banned || false,
                createdAt: user?.createdAt || null,
                updatedAt: user?.updatedAt || null,
                imageUrl: user?.imageUrl || '',
                hasImage: user?.hasImage || false,
                primaryEmailAddressId: user?.primaryEmailAddressId || '',
                primaryPhoneNumberId: user?.primaryPhoneNumberId || '',
                primaryWeb3WalletId: user?.primaryWeb3WalletId || '',
                lastSignInAt: user?.lastSignInAt || null,
                externalId: user?.externalId || '',
                username: user?.username || '',
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                publicMetadata: user?.publicMetadata || {},
                privateMetadata: user?.privateMetadata || {},
                unsafeMetadata: user?.unsafeMetadata || {},
                emailAddresses: user?.emailAddresses || [],
                phoneNumbers: user?.phoneNumbers || [],
                web3Wallets: user?.web3Wallets || [],
                externalAccounts: user?.externalAccounts || [],
                samlAccounts: user?.samlAccounts || [],
                lastActiveAt: user?.lastActiveAt || null,
                createOrganizationEnabled:
                    user?.createOrganizationEnabled || false,
            };
        }
    );
    console.log('AAU:123--users count:\n', users.length);
    return (
        <div className='grid md:grid-cols-2 gap-4'>
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    status={user?.publicMetadata?.status}
                    username={user?.privateMetadata?.meeter?.username}
                    firstName={user?.privateMetadata?.meeter?.firstName}
                    lastName={user?.privateMetadata?.meeter?.lastName}
                    email={user?.privateMetadata?.meeter?.email}
                    id={user?.privateMetadata?.meeter?.id}
                    clerkId={user?.privateMetadata?.meeter?.clerkId}
                    jerichoId={user?.privateMetadata?.meeter?.jerichoId}
                    sub={user?.privateMetadata?.meeter?.sub}
                    imageURL={user?.imageUrl}
                    hasImage={user?.hasImage}
                    roles={user?.publicMetadata?.roles}
                    orgId={user?.privateMetadata?.meeter?.orgId}
                    orgCode={user?.privateMetadata?.meeter?.orgCode}
                    orgName={user?.privateMetadata}
                    banned={user?.banned}
                />
            ))}
        </div>
    );
};

export default ShowUsersPage;
