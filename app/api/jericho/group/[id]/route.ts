import { NextResponse } from 'next/server';
import axios from 'axios';
import { getClerkUsers, getMetaAction, storeMetaAction } from '@/utils/clerk';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    // Example of how to use the token with axios
    // const apiCall = await axios.get('some-url', {
    //     headers: { Authorization: `Bearer ${bearerToken}` }
    // });

    const response = {
        message: `DELETE api/jericho/group/${id}`,
        groupId: id,
        token: bearerToken, // Added for demonstration, remove in production
    };

    console.log('🟨 => route.ts:26 => response:', response);

    return NextResponse.json(response);
}
