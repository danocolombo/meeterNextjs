import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Hello World' });
}

export async function POST(req: Request) {
    //* ------------------------------------------------
    //* attempt to get Jericho api token for user
    //* ------------------------------------------------
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const { id, email } = await req.json();
        const jerichoRequest = {
            email,
            sub: id,
        };
        const jerichoResponse = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jerichoRequest),
        });
        if (!jerichoResponse.ok) {
            throw new Error(`Error: ${jerichoResponse.statusText}`);
        }
        const jerichoResponseData = await jerichoResponse.json();
        if (jerichoResponseData.status === 200) {
            return NextResponse.json({
                status: jerichoResponseData.status,
                message: `POST response from api/apitoken/login`,
                request: { id, email },
                data: jerichoResponseData.data,
                apiToken: jerichoResponseData.token,
            });
        } else {
            return NextResponse.json({
                status: jerichoResponseData.status,
                message: `POST response from api/apitoken/login`,
                request: { id, email },
                data: jerichoResponseData,
            });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
