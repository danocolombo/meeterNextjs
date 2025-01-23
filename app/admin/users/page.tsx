import React from 'react';
import { clerkClient } from '@clerk/nextjs/server';
import UserCard from '@/components/admin/userCard';
import { UserProfileType } from '@/utils/types';

const ShowUsersPage = async () => {
    const response = await clerkClient.users.getUserList();
    const users = [
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
    return (
        <div className='grid md:grid-cols-2 gap-4'>
            {users.map((user) => (
                <UserCard
                    key={user.jericho_id}
                    firstName={user.first_name}
                    lastName={user.last_name}
                    email={user.email}
                    id={user.jericho_id}
                    clerkId={user.jericho_id}
                    jerichoId={user.jericho_id}
                    sub={user.cognito_sub}
                    orgId={user.default_org_id}
                    orgCode={user.default_org_id}
                    orgName={user.default_org_id}
                />
            ))}
        </div>
    );
};

export default ShowUsersPage;
