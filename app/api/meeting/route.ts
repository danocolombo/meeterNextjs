import { NextResponse } from 'next/server';
import axios from 'axios';
import { type PUT_DATA, type DB_DATA } from './types';
import { type MeetingType } from '@/utils/types';
import { MEETING_TYPE } from '@/utils/constants';
import { printObject } from '@/utils/helpers';

export async function POST(request: Request) {
    console.log('🎯 Server-side POST request received');
    debugger; // This will pause in VSCode when using the debugger
    const body = await request.json();
    printObject('🎯 POST body in server:', body);

    // Process the received data (e.g., save to database)
    return NextResponse.json({
        status: 200,
        message: 'Meeting POST !! NOT IMPLEMENTED !!',
        data: { id: 'tbd' },
    });
}
