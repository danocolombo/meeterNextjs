import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    console.log(`🟨 api/meeting/${id}/route --- 333333333333333333333333`);
    // get the body of the PUT to process
    const meeting = await request.json();
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // const response = await axios({
        //     method: 'PUT',
        //     url: `${baseUrl}/api/jericho/meeting/${meeting.id}`,
        //     data: {
        //         ...meeting,
        //     },
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${bearerToken}`,
        //     },
        // });
        return NextResponse.json(
            {
                message: 'Success',
                data: {
                    condition: 'NOT IMPLEMENTED',
                    method: 'PUT',
                    url: `${baseUrl}/api/jericho/meeting/${meeting.id}`,
                    meetingReceived: meeting,
                    response: null,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        //return 422 with details
        return NextResponse.json(
            {
                message: 'The failure message',
                data: {
                    error: 'api/meeting PUT failure',
                    meetingReceived: meeting,
                },
            },
            { status: 422 }
        );
    }
}
