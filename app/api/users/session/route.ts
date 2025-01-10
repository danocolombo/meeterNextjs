import { NextResponse } from 'next/server';
/*
userId: string;
    username?: string;
    userEmail?: string;
    clerkId?: string;
    cognitoSub?: string;
    meeterUserRole?: string;
    meeterClientId?: string;
    cognitoToken?: string;
    jerichoToken?: string;
    expiresAt?: Date;
*/
export async function POST(request: Request) {
    const body = await request.json();

    // Encode the secret key
    const encodedKey = new TextEncoder().encode(body.token);
    const decodedKey = new TextDecoder().decode(encodedKey);

    console.log('encodedKey: ', encodedKey);
    const content = {
        body: body,
        encodedKey: encodedKey,
        decodedKey: decodedKey,
    };
    return NextResponse.json({ success: true, data: content });
}
