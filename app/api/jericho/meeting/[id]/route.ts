import { NextResponse } from 'next/server';
import axios from 'axios';
import { printObject } from '@/utils/helpers';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const meeting = await request.json(); // Ensure the request body is parsed correctly
    let DEV = true;
    const platformValue = process.env.NEXT_PUBLIC_MEETER_PLATFORM || 'DEV';
    if (platformValue === 'PROD') {
        DEV = false;
    }
    // DEV ? console.log('3333333333333333333333333333333333333333') : null;
    // DEV
    //     ? console.log(`🟨 => jericho/meeting/[${id}]/route.ts:21:id:\n`, id)
    //     : null;
    // DEV
    //     ? printObject(
    //           `🟨 => jericho/meeting/[${id}]/route.ts:16:meeting:\n`,
    //           meeting
    //       )
    //     : null;
    

    // get the body of the PUT to process
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }
    const bearerToken = authHeader.replace('Bearer ', '');
    // DEV
    //     ? console.log(
    //           `🟨 => jericho/meeting/[${id}]/route.ts:34:bearer: ${bearerToken}`):null;
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const testUrl = `https://fortsonguru.com/jericho/public/api/meeting/${meeting.organization_id}/${meeting.id}`;
        const createdUrl = `${baseUrl}/api/jericho/meeting/${meeting.organization_id}/${meeting.id}`;
        const response = await axios({
            method: 'PUT',
            url: testUrl,
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
        
        // DEV
        //     ? printObject(
        //           `🟨 => jericho/meeting/[${id}]/route.ts:79:response:\n`,
        //           response
        //       )
        //     : null;
        const responseData = {
            body: response || '',
        };
        // DEV
        //     ? printObject(
        //           `🟨 => jericho/meeting/[${id}]/route.ts:87:responseData:\n`,
        //           responseData
        //       )
        //     : null;

        return NextResponse.json(responseData);
    } catch (error: any) {
        //return 422 with details
        // console.error('🟨 api/meeting/[id]/route.ts --- 63 error:\n', error);
        // console.log('########################################################');
        DEV ? printObject(`🟨 api/meeting/[${id}]/route.ts --- 63 error:\n`, error) : null;

        let errorResponse = {};
        if (DEV){
            errorResponse = {
                message: error.message,
                data: {
                    message: 'api/meeting PUT failure',
                    url: error?.config?.url || '',
                    method: error?.config?.method || '',
                    apiToken: error?.config?.headers?.Authorization || '',
                    data: JSON.stringify(error?.config?.data) || '',
                    meetingReceived: meeting,
                    
                    // error: error,
                },
            };
            console.log(`🟨 api/meeting/[${id}]/route.ts --- 115 errorResponse:\n`, errorResponse);
        } else {
            errorResponse = {
                message: 'Failure updating meeting',
                data: {
                    
                },
            };
        }

        return NextResponse.json(
            errorResponse,
            { status: error?.status || 500 }
        );
    }
}
