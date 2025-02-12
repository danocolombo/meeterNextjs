import { request } from 'http';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    // get the body of the PUT to process
    const body = await request.json();
    console.log('222222222222222222222222222222222222');
    console.log('🟨 => api/jericho/group/route.ts:8 => body:', body);
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    // Example of how to use the token with axios
    // const apiCall = await axios.get('some-url', {
    //     headers: { Authorization: `Bearer ${bearerToken}` }
    // });

    const response = {
        message: `POST api/jericho/group`,
        body: body,
        token: bearerToken, // Added for demonstration, remove in production
    };

    console.log('🟨 => api/jericho/group/route.ts:24 => response:', response);

    return NextResponse.json(response);
}
