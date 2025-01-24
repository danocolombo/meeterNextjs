import React from 'react';
import { printObject } from '@/utils/helpers';
const UserCard = (params) => {
    const {
        status,
        username,
        firstName,
        lastName,
        email,
        id,
        clerkId,
        jerichoId,
        sub,
        imageURL,
        hasImage,
        roles,
        orgId,
        orgCode,
        orgName,
        banned,
    } = params;
    // printObject('UserCard', params);
    return (
        <div
            className={`border p-8 rounded-md ${
                jerichoId === '0' ? 'bg-warning text-warning-foreground' : ''
            }`}
        >
            <p className='text-lg font-semibold'>
                {firstName} {lastName}
            </p>
            <p className='text-sm text-gray-500'>{email}</p>
            <p className='text-sm text-gray-500'>{username}</p>
            {jerichoId?.length > 1 ? (
                <p className='text-sm text-gray-500'>{jerichoId}</p>
            ) : jerichoId === '0' ? (
                <p className='text-md text-white-800 underline'>PENDING</p>
            ) : (
                <p className='text-md text-warning-foreground underline'>
                    No Meeter definition
                </p>
            )}
        </div>
    );
};

export default UserCard;
