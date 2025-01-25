'use client';
import React from 'react';
import { useParams, redirect } from 'next/navigation';
import { getClerkUser } from '@/utils/clerk';
import { printObject } from '@/utils/helpers';

const AdminUserPage = () => {
    const { id } = useParams();
    if (!id) redirect('/admin/users');

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUser = async () => {
            const userData: any = await getClerkUser(id);
            setUser(userData);
            setLoading(false);
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    printObject('AAU:21--user:\n', user);

    return (
        <div>
            <h1>AdminUserPage for user {id}</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
};

export default AdminUserPage;
