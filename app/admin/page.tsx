import React from 'react';
import Link from 'next/link';
const AdminPage = () => {
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
