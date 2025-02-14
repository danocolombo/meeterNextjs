import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    console.log('3333333333333333333333333333333333333333');
    const { id } = params;
    // get the body of the PUT to process
    const body = await request.json();
    // console.log('🟨 => jericho/meeting/[id]/route.ts:11 => body\n:', body);
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    // Example of how to use the token with axios
    // const apiCall = await axios.get('some-url', {
    //     headers: { Authorization: `Bearer ${bearerToken}` }
    // });

    const response = {
        status: 200,
        message: `PUT api/jericho/meeting/${id}`,
        body: body,
        // token: bearerToken, // Added for demonstration, remove in production
    };

    console.log('🟨 => jericho/meeting/[id]/route.ts:29:response:\n', response);

    return NextResponse.json(response);
}
