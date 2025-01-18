import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Hello api/users/meta' });
}

export async function POST(request: Request) {
    const body = await request.json();
    const apiToken = body.api_token;

    return NextResponse.json({
        message: 'META POST HIT',
        token: apiToken,
    });
}
