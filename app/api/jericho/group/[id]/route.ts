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
    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header missing' },
            { status: 401 }
        );
    }
    const bearerToken = authHeader.replace('Bearer ', '');
    const testUrl = `https://fortsonguru.com/jericho/public/api/group/${id}`;
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const response = await axios({
            method: 'DELETE',
            url: testUrl,
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
            message: 'Group deleted successfully',
            data: response.data,
        });
    } catch (error) {
        if (isAxiosError(error)) {
            const errorDetails = {
                requestUrl: testUrl,
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
                    error.response?.data?.message || 'Failed to update group',
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
                originalRequest: testUrl,
            },
        });
    }

    // console.log('DELETE-DELETE-DELETE-DELETE-DELETE');
    // const response = {
    //     message: `DELETE api/jericho/group/${id}`,
    //     groupId: id,
    //     token: bearerToken, // Added for demonstration, remove in production
    // };

    // console.log('🟨 => route.ts:26 => response:', response);

    // return NextResponse.json(response);
}
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    // get the body of the PUT to process
    const group = await request.json();
    console.log('🟨 WHOOP-WHOOP-WHOOP');
    printObject(`🟨 => api/jericho/group/${id}/route.ts:37 => group:\n`, group);

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header missing' },
            { status: 401 }
        );
    }
    const bearerToken = authHeader.replace('Bearer ', '');
    const testUrl = `https://fortsonguru.com/jericho/public/api/group/${group.id}`;

    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const response = await axios({
            method: 'PUT',
            url: testUrl,
            data: group,
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
            message: 'Group updated successfully',
            data: response.data,
        });
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const errorDetails = {
                requestUrl: testUrl,
                requestData: group,
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
                    error.response?.data?.message || 'Failed to update group',
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
                originalRequest: group,
            },
        });
    }
}
