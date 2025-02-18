import { NextResponse } from 'next/server';
import axios from 'axios';
import { printObject } from '@/utils/helpers';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const meeting = await request.json();
    let DEV = true;
    const platformValue = process.env.NEXT_PUBLIC_MEETER_PLATFORM || 'DEV';
    if (platformValue === 'PROD') {
        DEV = false;
    }
    DEV ? console.log('3333333333333333333333333333333333333333') : null;
    DEV
        ? console.log('🟨 => jericho/meeting/[id]/route.ts:21:id:\n', id)
        : null;
    DEV
        ? printObject(
              '🟨 => jericho/meeting/[id]/route.ts:16:request:\n',
              request
          )
        : null;
    

    // get the body of the PUT to process
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const response = await axios({
            method: 'PUT',
            url: `${baseUrl}/api/jericho/meeting/${meeting.organization_id}/${meeting.id}`,
            data: {
                ...meeting,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
        });
        //* ------------------------------------------------
        //* This is how we throw error to catch to send back...
        // if (DEV) {
        //     class HttpError extends Error {
        //         constructor(message: string, public status: number) {
        //             super(message);
        //             this.name = 'JerichoError';
        //         }
        //     }
        //     throw new HttpError(
        //         'Custom error message for meeting update failure',
        //         422
        //     );
        // }
        //* this is the end of the throw error example...
        //* ------------------------------------------------
        // Or for a more specific error type:
        // throw new CustomMeetingError('Meeting update failed', { meetingId: meeting.id });

        // You can define a custom error class outside the function:
        // class CustomMeetingError extends Error {
        //   constructor(message: string, public details: any) {
        //     super(message);
        //     this.name = 'CustomMeetingError';
        //   }
        // }
        const responseData = {
            // status: 200,
            // message: `PUT api/jericho/meeting/${id}`,
            body: response || '',
            // token: bearerToken, // Added for demonstration, remove in production
        };
        DEV
            ? console.log(
                  '🟨 => jericho/meeting/[id]/route.ts:69:response:\n',
                  response
              )
            : null;
        DEV
            ? console.log(
                  '🟨 => jericho/meeting/[id]/route.ts:70:responseData:\n',
                  responseData
              )
            : null;

        return NextResponse.json(responseData);
    } catch (error: any) {
        //return 422 with details
        // console.error('🟨 api/meeting/[id]/route.ts --- 63 error:\n', error);
        // console.log('########################################################');

        return NextResponse.json(
            {
                message: 'The failure message',
                data: {
                    error: 'api/meeting PUT failure',
                    meetingReceived: meeting,
                    apiToken: bearerToken,
                },
            },
            { status: error?.status || 500 }
        );
    }
}
