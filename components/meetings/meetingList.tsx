'use client';
import { printObject } from '@/utils/helpers';
import React, { useState, useEffect } from 'react';

const MeetingList = () => {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const baseUrl =
                    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const response = await fetch(
                    `${baseUrl}/api/admin/clerk/users`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const clerkUsersList = await response.json();
                console.log('CMML:19--clerkUsersList:', clerkUsersList);
                console.log(
                    'CMML:19--clerkUsersList.length:',
                    clerkUsersList?.length || 0
                );
                setUserCount(clerkUsersList?.length || 0);
            } catch (error) {
                console.error('Error in fetchUsers:', error);
                setUserCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;

    return <div>Number of users: {userCount}</div>;
};

export default MeetingList;
