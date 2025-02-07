import { NextResponse } from 'next/server';
import {type POST_DATA, type DB_DATA} from './types';


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



    console.log('🟨 => route.ts:35 => PUT body:', body);
    console.log('🟨 => route.ts:36 => postData:', postData);

    // Process the received data (e.g., save to database)

    return NextResponse.json({
        status: 200,
        message: 'Meeting PUT saved successfully',
        data: { id: 'tbd' },
    });
}
