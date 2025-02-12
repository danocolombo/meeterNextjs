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
    console.log('DELETE-DELETE-DELETE-DELETE-DELETE');
    const response = {
        message: `DELETE api/jericho/group/${id}`,
        groupId: id,
        token: bearerToken, // Added for demonstration, remove in production
    };

    console.log('🟨 => route.ts:26 => response:', response);

    return NextResponse.json(response);
}
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    // get the body of the PUT to process
    const body = await request.json();
    console.log('🟨 => route.ts:37 => body:', body);
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    // Example of how to use the token with axios
    // const apiCall = await axios.get('some-url', {
    //     headers: { Authorization: `Bearer ${bearerToken}` }
    // });

    const response = {
        message: `PUT api/jericho/group/${id}`,
        body: body,
        token: bearerToken, // Added for demonstration, remove in production
    };

    console.log('🟨 => route.ts:53 => response:', response);

    return NextResponse.json(response);
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    // get the body of the PUT to process
    const body = await request.json();
    console.log('🟨 => api/jericho/group/[id]/route.ts:65 => body:', body);
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    // Example of how to use the token with axios
    // const apiCall = await axios.get('some-url', {
    //     headers: { Authorization: `Bearer ${bearerToken}` }
    // });

    const response = {
        message: `POST api/jericho/group/${id}`,
        body: body,
        token: bearerToken, // Added for demonstration, remove in production
    };
    console.log('********************************************************');
    console.log('********************************************************');
    console.log(
        '🟨 => api/jericho/group/[id]/route.ts:82 => response:',
        response
    );
    console.log('********************************************************');
    console.log('********************************************************');

    return NextResponse.json(response);
}
