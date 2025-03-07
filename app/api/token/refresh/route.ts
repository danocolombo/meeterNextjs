import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs';
import axios from 'axios';
import { printObject } from '@/utils/helpers';

export async function GET() {
    try {
        // const user = await currentUser();

        // if (!user?.primaryEmailAddressId) {
        //     return NextResponse.json(
        //         { error: 'No primary email found' },
        //         { status: 400 }
        //     );
        // }
        console.log('🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐');
        // printObject('AATRR: 17 user:\n', user);
        console.log('🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐🍐');
        // const primaryEmail = user.emailAddresses.find(
        //     (email) => email.id === user.primaryEmailAddressId
        // )?.emailAddress;

        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        console.log('🌼🌼🌼 AATRR:25--> HERE');
        const response = await axios.post(
            new URL('/api/apitoken/login', baseUrl).toString(),
            {
                username: 'dcolombo',
                sub: '455ffe37-bbbc-494c-9f50-22bb5ca70d5a',
                email: 'danocolombo@gmail.com',
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️');
        printObject('AATRR: 40 response:\n', response);
        console.log('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️');
        return NextResponse.json({ token: response.data?.token });
    } catch (error) {
        console.error('Token refresh failed:', error);
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}
