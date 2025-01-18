import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getClient } from '@/utils/clerk';

export async function GET(request: NextRequest) {
    const { userId } = await request.json();

    const client = await clerkClient;

    const user = await client.users.getUser(userId);

    return NextResponse.json(user.privateMetadata);
}
