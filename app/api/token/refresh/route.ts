import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import axios from 'axios';

export async function GET() {
    try {
        const user = await currentUser();

        if (!user?.primaryEmailAddressId) {
            return NextResponse.json(
                { error: 'No primary email found' },
                { status: 400 }
            );
        }

        const primaryEmail = user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
        )?.emailAddress;

        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await axios.post(
            new URL('/api/apitoken/login', baseUrl).toString(),
            {
                id: user.id,
                email: primaryEmail,
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        return NextResponse.json({ token: response.data?.token });
    } catch (error) {
        console.error('Token refresh failed:', error);
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}
