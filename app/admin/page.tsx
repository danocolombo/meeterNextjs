import React from 'react';
import { checkRole, getSessionInfo } from '@/utils/roles';
import Link from 'next/link';
const AdminPage = async () => {
    // Protect the page from users who are not admins
    const sessionInfo = await getSessionInfo();
    console.log('aap:5-->sessionInfo\n', sessionInfo);
    const isAdmin = await checkRole('admin');
    console.log('aap:7-->isAdmin\n', isAdmin);
    if (!isAdmin) {
        redirect('/');
    }
    return (
        <>
            <div>AdminPage</div>
            <div className='p-4 grid col-2'>
                <Link href='/admin/users' className='text-blue-500 underline'>
                    List Users
                </Link>
            </div>
        </>
    );
};

export default AdminPage;
