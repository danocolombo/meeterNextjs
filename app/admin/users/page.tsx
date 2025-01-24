import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { clerkClient } from '@clerk/nextjs/server';
import UserCard from '@/components/admin/userCard';
import { UserProfileType, ClerkUserType } from '@/utils/types';
import { printObject } from '@/utils/helpers';

const ShowUsersPage = async () => {
    const response = await clerkClient.users.getUserList();
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
            //   there may be times when clerk has user but
            //   account is in process of registration, and/or
            //   no jericho_id is assigned yet. For these cases
            //   need to pull up additional information to identify
            printObject('AAU:132--user:\n', user);
            return {
                id: user?.id,
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
    // console.log('AAU:123--users count:\n', users.length);
    // printObject('AAU:123--users:\n', users);
    return (
        <div className='grid md:grid-cols-2 gap-4'>
            {users.map((user) => (
                <UserCard
                    key={user?.id}
                    status={user?.publicMetadata?.status}
                    username={user?.privateMetadata?.meeter?.username}
                    firstName={user?.privateMetadata?.meeter?.firstName}
                    lastName={user?.privateMetadata?.meeter?.lastName}
                    email={
                        user.emailAddresses.find(
                            (e) => e.id === user.primaryEmailAddressId
                        )?.emailAddress
                    }
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
