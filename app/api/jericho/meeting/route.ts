import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    console.log('🟨 => route.ts:4 => POST body:', body);

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

    console.log('🟨 => route.ts:4 => PUT body:', body);

    // Process the received data (e.g., save to database)

    return NextResponse.json({
        status: 200,
        message: 'Meeting PUT saved successfully',
        data: { id: 'tbd' },
    });
}
