import { NextResponse } from 'next/server';
import axios from 'axios';
import {type POST_DATA, type DB_DATA} from './types';
import { type MeetingType } from '@/utils/types';
import { MEETING_TYPE } from '@/utils/constants';

export async function POST(request: Request) {
    const body = await request.json();

    console.log('🟨 => route.ts:8 => POST body:', body);

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
    }
    if(body.groups) {
        postData.groups = body.groups.map((group: any) => {
            return {
                id: group?.id ? group?.id : null,
                action: group?.id ? null : 'POST',
            }
        });
    }

    // console.log('🟨 => route.ts:35 => PUT body:', body);
    // console.log('🟨 => route.ts:36 => postData:', postData);

    //=================================================================================================
    // get the meeting from the database
    //=================================================================================================
    let dbMeeting: MEETING_TYPE | null = null;
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
            dbMeeting = {...dbResponse};
        } else {
            throw new Error('Failed to fetch meeting data');
        }

    } catch (error: any) {
        console.log('🟨 => route.ts:67 => CATCH:', error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'An error occurred';
        return NextResponse.json({ status: 500, message: errorMessage, data: {id: null} });
    }

    //=================================================================================================
    // set the DB_DATA
    //=================================================================================================
    console.log('🟨 => route.ts:79 => dbMeeting:', dbMeeting);
    const dbData: DB_DATA = {
        groups: [],
    }
    if(dbMeeting?.groups) {
        dbData.groups = dbMeeting?.groups.map((group: any) => {
            return {
                id:group?.id,
                action: null
            }
        });
    }
    console.log('🟨 => route.ts:91 => postData:', postData);
    console.log('🟨 => route.ts:79 => dbData:', dbData);
    // // Process the received data (e.g., save to database)

    return NextResponse.json({
        status: 200,
        message: 'Meeting PUT saved successfully',
        data: { id: 'tbd' },
    });
}
