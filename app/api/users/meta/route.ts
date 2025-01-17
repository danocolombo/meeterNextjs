import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    const { userId } = await request.json();

    const client = clerkClient;
    console.log('AAUM:8 -> client:\n', client);
    const user = await client.users.getUser(userId);
    console.log('AAUM:10 -> user:\n', user);
    return NextResponse.json(user.privateMetadata);
}
