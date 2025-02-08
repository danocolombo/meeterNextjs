import { NextResponse } from 'next/server';
import axios from 'axios';
import { type POST_DATA, type DB_DATA } from './types';
import { type MeetingType } from '@/utils/types';
import { MEETING_TYPE } from '@/utils/constants';

export async function POST(request: Request) {
    const body = await request.json();

    console.log('🟨 => route.ts:10 => POST body:', body);

    // Process the received data (e.g., save to database)

    return NextResponse.json({
        status: 200,
        message: 'Meeting POST saved successfully',
        data: { id: 'tbd' },
    });
}
//* =================================================================================================
//* PUT --- Update a meeting, and groups if provided.
//* =================================================================================================

export async function PUT(request: Request) {
    const body = await request.json();

    const postData: POST_DATA = {
        meeting: {
            id: body.id,
            action: null,
        },
        groups: [],
    };
    if (body.groups) {
        postData.groups = body.groups.map((group: any) => {
            return {
                id: group?.id ? group?.id : null,
                action: group?.id ? null : 'POST',
            };
        });
    }

    // console.log('🟨 => route.ts:43 => PUT body:', body);
    // console.log('🟨 => route.ts:44 => postData:', postData);

    //=================================================================================================
    // get the meeting from the database
    //=================================================================================================
    let dbMeeting: any | null = null;
    try {
        const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting/${body.organizationId}/${body.id}`;
        const response = await axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${body.apiToken}`,
            },
        });
        let dbResponse: any = null;
        if (response?.data?.status === 200) {
            dbResponse = response.data.data;
            dbMeeting = { ...dbResponse };
        } else {
            throw new Error('Failed to fetch meeting data');
        }
    } catch (error: any) {
        console.log('🟨 => route.ts:66 => CATCH:', error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'An error occurred';
        return NextResponse.json({
            status: 500,
            message: errorMessage,
            data: { id: null },
        });
    }

    //=================================================================================================
    // set the DB_DATA
    //=================================================================================================
    // console.log('🟨 => route.ts:81 => dbMeeting:', dbMeeting);
    const dbData: DB_DATA = {
        groups: [],
    };
    if (dbMeeting?.groups) {
        dbData.groups = dbMeeting?.groups.map((group: any) => {
            return {
                id: group?.id,
                action: null,
            };
        });
    }

    // check if the meeting has changed
    let postCompare: any = { ...body };
    delete postCompare.groups;
    delete postCompare.organizationId;
    delete postCompare.apiToken;
    if (postCompare?.facilitator_contact == '') {
        postCompare.facilitator_contact = null;
    }
    if (postCompare?.support_contact == '') {
        postCompare.support_contact = null;
    }
    if (postCompare?.attendance_count == 0) {
        postCompare.attendance_count = null;
    }
    if (postCompare?.meal_count == 0) {
        postCompare.meal_count = null;
    }
    if (postCompare?.newcomers_count == 0) {
        postCompare.newcomers_count = null;
    }
    let dbCompare: any = { ...dbMeeting };
    delete dbCompare.groups;

    const hasChanges = Object.keys(postCompare).some(
        (key) =>
            JSON.stringify(postCompare[key]) !== JSON.stringify(dbCompare[key])
    );
    if (hasChanges) {
        postData.meeting.action = 'PUT';
    }
    console.log('🟨 => route.ts:126 => hasChanges:', hasChanges);
    console.log('🟨 => route.ts:127 => postData:', postData);
    console.log('🟨 => route.ts:128 => dbData:', dbData);
    postData.meeting.action = hasChanges ? 'PUT' : null;
    return NextResponse.json({
        status: 200,
        message: 'Meeting PUT saved successfully',
        data: { id: 'tbd' },
    });
}
