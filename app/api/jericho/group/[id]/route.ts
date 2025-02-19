import { NextResponse } from 'next/server';
import axios, { isAxiosError } from 'axios';
import { getClerkUsers, getMetaAction, storeMetaAction } from '@/utils/clerk';
import { printObject } from '@/utils/helpers';

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
    printObject(`🟨 => api/jericho/group/${id}/route.ts:37 => body:\n`, body);
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    // Example of how to use the token with axios
    // const apiCall = await axios.get('some-url', {
    //     headers: { Authorization: `Bearer ${bearerToken}` }
    // });

    return NextResponse.json(body);
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    // get the body of the PUT to process
    const body = await request.json();
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
    const testUrl = `https://fortsonguru.com/jericho/public/api/group`;

    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const response = await axios({
            method: 'POST',
            url: testUrl,
            data: body,
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
            data: response.data,
        });
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const errorDetails = {
                requestUrl: testUrl,
                requestData: meeting,
                errorMessage: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack:
                    process.env.NEXT_PUBLIC_MEETER_PLATFORM === 'DEV'
                        ? error.stack
                        : undefined,
            };

            printObject('🟨 Jericho API Error:', errorDetails);

            return NextResponse.json({
                status: error.response?.status || 500,
                success: false,
                message:
                    error.response?.data?.message || 'Failed to update meeting',
                error: errorDetails,
            });
        }

        // Handle non-Axios errors
        console.error('Non-Axios error:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal server error',
            error: {
                details: (error as Error).message,
                originalRequest: body,
            },
        });
    }
}
