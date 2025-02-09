import { NextResponse } from 'next/server';
import axios from 'axios';
import { type PUT_DATA, type DB_DATA } from './types';
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
    const putMeeting = await request.json();

    const putData: PUT_DATA = {
        meeting: {
            id: putMeeting.id,
            action: null,
        },
        groups: [],
    };
    if (putMeeting.groups) {
        putData.groups = putMeeting.groups.map((group: any, index: number) => {
            return {
                id: group?.id ? group?.id : index.toString(),
                action: group?.id ? null : 'POST',
            };
        });
    }

    // console.log('🟨 => route.ts:43 => PUT putMeeting:', putMeeting);
    // console.log('🟨 => route.ts:44 => putData:', putData);

    //=================================================================================================
    // get the meeting from the database
    //=================================================================================================
    let dbMeeting: any | null = null;
    try {
        const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting/${putMeeting.organizationId}/${putMeeting.id}`;
        const response = await axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${putMeeting.apiToken}`,
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
    //* =================================================================================================
    //* putCompare definition
    //* =================================================================================================
    let putCompare: any = { ...putMeeting };
    delete putCompare.groups;
    delete putCompare.organizationId;
    delete putCompare.apiToken;

    // Convert empty strings and zeros to null
    Object.keys(putCompare).forEach((key) => {
        if (putCompare[key] === '' || putCompare[key] === 0) {
            putCompare[key] = null;
        }
    });

    //* =================================================================================================
    //* dbCompare definition
    //* =================================================================================================
    let dbCompare: any = { ...dbMeeting };
    delete dbCompare.groups;
    // console.log('🟨 => route.ts:116 => putCompare:', putCompare);
    // console.log('🟨 => route.ts:117 => dbCompare:', dbCompare);

    const hasChanges = Object.keys(putCompare).some(
        (key) =>
            JSON.stringify(putCompare[key]) !== JSON.stringify(dbCompare[key])
    );
    if (hasChanges) {
        putData.meeting.action = 'PUT';
    }
    console.log('🟨 => route.ts:126 => hasChanges:', hasChanges);
    console.log('🟨 => route.ts:127 => postData:', putData);
    console.log('🟨 => route.ts:128 => dbData:', dbData);
    putData.meeting.action = hasChanges ? 'PUT' : null;
    return NextResponse.json({
        status: 200,
        message: 'Meeting PUT saved successfully',
        data: { id: 'tbd' },
    });
}
