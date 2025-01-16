import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Hello World' });
}

export async function POST(req: Request) {
    try {
        const { id, email } = await req.json();
        return NextResponse.json({
            message: `POST response from api/apitoken/login`,
            request: { id, email },
            data: {
                id: 2,
                name: null,
                email: 'fortsonguru@gmail.com',
                email_verified_at: null,
                created_at: '2024-03-29T00:30:21.000000Z',
                updated_at: '2024-03-29T00:30:21.000000Z',
                sub: '$2y$12$ZOdrAv9/TeT92U0iEYZO/uM6LLhAMiKxY6HRa3dW57gYbX4.1Gvku',
                username: 'mtrlead',
            },
            token: '272|0rdp0ij8YTjnsnizBWnlEppIJ1CpoxlYr5rCRtSL7efff077',
            cognitoSub: id,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GETOLD(
    req: Request,
    { params }: { params: { id: string; email: string } }
) {
    try {
        const { id, email } = params;

        return NextResponse.json({
            message: `GET api/user/[${id}]`,
            data: {
                id: 2,
                name: null,
                email: 'fortsonguru@gmail.com',
                email_verified_at: null,
                created_at: '2024-03-29T00:30:21.000000Z',
                updated_at: '2024-03-29T00:30:21.000000Z',
                sub: '$2y$12$ZOdrAv9/TeT92U0iEYZO/uM6LLhAMiKxY6HRa3dW57gYbX4.1Gvku',
                username: 'mtrlead',
            },
            token: '272|0rdp0ij8YTjnsnizBWnlEppIJ1CpoxlYr5rCRtSL7efff077',
            cognitoSub: id,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
