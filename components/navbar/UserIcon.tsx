import React from 'react';
import { fetchProfileImage } from '@/utils/actions';
import { LuUser } from 'react-icons/lu';
async function UserIcon() {
    try {
        const profileImage = await fetchProfileImage();
        if (profileImage) {
            return (
                <img
                    src={profileImage}
                    alt='Profile Image'
                    className='h-6 w-6 rounded-full object-cover'
                />
            );
        }
        return (
            <LuUser className='h=6 w-6 bg-primary rounded-full text-white' />
        );
    } catch (error) {
        console.error('Error fetching profile image: ', error);
        return (
            <LuUser className='h=6 w-6 bg-primary rounded-full text-white' />
        );
    }
}

export default UserIcon;
