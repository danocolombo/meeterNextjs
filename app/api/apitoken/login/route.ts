import { printObject } from '@/utils/helpers';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;

        // Parse and validate request body
        const body = await req.json();
        // console.log('Received request body:', body);

        if (!body.username || !body.id || !body.email) {
            return NextResponse.json(
                {
                    status: 400,
                    error: 'Missing required fields',
                    receivedData: body,
                },
                { status: 400 }
            );
        }

        const { id, email, username } = body;

        // printObject('🔍 Request data:', { id, email, username });

        const jerichoResponse = await axios.post(
            `${baseUrl}/login`,
            {
                username,
                email,
                sub: id,
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        // printObject('📥 Jericho API response:', jerichoResponse.data);

        const returnValues = {
            status: jerichoResponse.data.status,
            message: `POST response from jericho: api/apitoken/login`,
            request: { id, email },
            data: jerichoResponse.data,
            apiToken: jerichoResponse.data.token.plainTextToken,
        };

        return NextResponse.json(returnValues);
    } catch (error: any) {
        console.error('Detailed error:', error);

        const errorResponse = {
            status: 500,
            error:
                error.response?.data?.message ||
                error.message ||
                'An error occurred',
            requestData: error.config?.data,
            responseData: error.response?.data,
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
