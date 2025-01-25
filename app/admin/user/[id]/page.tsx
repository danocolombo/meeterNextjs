'use client';
import React from 'react';
import { useParams, redirect } from 'next/navigation';
import { getClerkUser } from '@/utils/clerk';
import { printObject } from '@/utils/helpers';
import { NavigateButton } from '@/components/form/Buttons';
import ExpandableJson from '@/components/ui/expanableJson';

const AdminUserPage = () => {
    const { id } = useParams();
    if (!id) redirect('/admin/users');

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUser = async () => {
            const userData = await getClerkUser(id);
            if (userData.status === 200) {
                const data = userData.data;
                printObject('AAU:20--data:', data);
                setUser(data);
            } else {
                console.log('AAU:22--error:', userData.message);
            }
            setLoading(false);
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }
    printObject('AAU:33--user:', user);
    return (
        <div className='mx-10 my-2'>
            <div className='flex justify-between items-center mb-4'>
                <h1>User Information</h1>
                <NavigateButton label='All Users' path='/admin/users' />
            </div>
            <div className={`border p-2 rounded`}>
                <div>
                    id: <span className='font-bold'>{user?.id}</span>
                </div>
                <div>
                    banned:{' '}
                    <span className='font-bold'>
                        {user?.banned ? 'true' : 'false'}
                    </span>
                </div>
                <div>
                    created:{' '}
                    <span className='font-bold'>
                        {new Date(user?.createdAt).toLocaleString()}
                    </span>
                </div>
            </div>
            <div>
                <h1>AdminUserPage for user {id}</h1>
                <pre>id: {user && user.id}</pre>{' '}
                {/* Example of accessing user object values */}
            </div>
            <ExpandableJson data={user} title='User Details' />
        </div>
    );
};

export default AdminUserPage;
