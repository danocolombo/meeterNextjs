'use client';
import React from 'react';
import { useParams, redirect } from 'next/navigation';
import { getClerkUser, activateClerkUser } from '@/utils/clerk';
import { printObject } from '@/utils/helpers';
import { NavigateButton } from '@/components/form/Buttons';
import ExpandableJson from '@/components/ui/expanableJson';

const AdminUserPage = () => {
    const { id } = useParams() as { id: string };
    if (!id) redirect('/admin/users');

    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        console.log('Effect running with id:', id);
        const fetchUser = async () => {
            const userData = await getClerkUser(id);
            console.log('Fetched user data:', userData);
            if (userData.status === 200) {
                setUser(userData.data);
            }
            setLoading(false);
        };
        fetchUser();
    }, [id]);

    const handleActivate = async () => {
        console.log('Button clicked!'); // Add this line first to verify the handler is being called
        try {
            if (!user?.id) {
                console.error('No user ID available');
                return;
            }
            console.log('Starting activation process for user:', user.id);
            console.log('User object:', user);
            const result = await activateClerkUser(user.id);
            console.log('Activation API response:', result);

            if (result.status === 200) {
                console.log(
                    'Activation successful, fetching updated user data'
                );
                const userData = await getClerkUser(id);
                console.log('Updated user data:', userData);

                if (userData.status === 200) {
                    setUser(userData.data);
                    console.log('User state updated successfully');
                }
            } else {
                console.error('Activation failed:', result.message);
            }
        } catch (error) {
            console.error('Activation error:', error);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Direct click handler called');
        handleActivate();
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    printObject('AAU:33--user:', user);
    return (
        <div className='mx-10 my-2'>
            <div className='flex flex-col gap-2 items-end mb-4'>
                <NavigateButton label='All Users' path='/admin/users' />
                {user?.privateMetadata?.status === 'pending' && (
                    <button
                        type='button'
                        onClick={handleClick}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    >
                        Activate User
                    </button>
                )}
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
