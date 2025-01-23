import React from 'react';

const UserCard = (params) => {
    const {
        key,
        firstName,
        lastName,
        email,
        id,
        clerkId,
        jerichoId,
        sub,
        orgId,
        orgCode,
        orgName,
    } = params;
    return (
        <div className='border p-8 rounded-md '>
            <p className='text-lg font-semibold'>
                {firstName} {lastName}
            </p>
        </div>
    );
};

export default UserCard;
