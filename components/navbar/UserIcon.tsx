'use client';
import React, { useState, useEffect } from 'react';
import { fetchProfileImage } from '@/utils/clerk';
import { LuUser } from 'react-icons/lu';

function UserIcon() {
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const getProfileImage = async () => {
            try {
                const image = await fetchProfileImage();
                setProfileImage(image);
            } catch (error) {
                console.error('Error fetching profile image: ', error);
                setProfileImage(null);
            }
        };

        getProfileImage();
    }, []);

    if (profileImage) {
        return (
            <img
                src={profileImage}
                alt='Profile Image'
                className='h-6 w-6 rounded-full object-cover'
            />
        );
    }

    return <LuUser className='h-6 w-6 bg-primary rounded-full text-white' />;
}

export default UserIcon;
