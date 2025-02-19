import { NextResponse } from 'next/server';
import axios, { isAxiosError } from 'axios';
import { printObject } from '@/utils/helpers';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const meeting = await request.json(); // Ensure the request body is parsed correctly

    // get the body of the PUT to process
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header missing' },
            { status: 401 }
        );
    }
    const bearerToken = authHeader.replace('Bearer ', '');

    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const testUrl = `https://fortsonguru.com/jericho/public/api/meeting/${meeting.organization_id}/${meeting.id}`;

        const response = await axios({
            method: 'PUT',
            url: testUrl,
            data: meeting,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        // Log the full response in development
        if (process.env.NEXT_PUBLIC_MEETER_PLATFORM === 'DEV') {
            printObject('🟨 Jericho API Response:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                headers: response.headers,
            });
        }

        // Verify response structure
        if (!response.data) {
            throw new Error('Empty response received from Jericho API');
        }

        return NextResponse.json({
            status: 200,
            success: true,
            message: 'Meeting updated successfully',
            data: response.data
        });

    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const errorDetails = {
                requestUrl: testUrl,
                requestData: meeting,
                errorMessage: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: process.env.NEXT_PUBLIC_MEETER_PLATFORM === 'DEV' ? error.stack : undefined
            };

            printObject('🟨 Jericho API Error:', errorDetails);

            return NextResponse.json({
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || 'Failed to update meeting',
                error: errorDetails
            });
        }

        // Handle non-Axios errors
        console.error('Non-Axios error:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
            error: {
                details: (error as Error).message,
                originalRequest: meeting,
            },
        });
    }
}
