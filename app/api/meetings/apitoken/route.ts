import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { session: string } }
) {
    try {
        console.log('params\n', params);
        // const { session } = await params;
        // if (!session) {
        //     return NextResponse.json(
        //         { message: 'Invalid session' },
        //         { status: 400 }
        //     );
        // }

        return NextResponse.json({
            message: `GET api/session/[id]]`,
            data: params,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const requestData = await req.json();
    return NextResponse.json({
        message: 'POSt api/session/[id]',
        body: requestData,
    });
}
export async function PUT() {
    return NextResponse.json({ message: 'PUT api/session/[id]' });
}
export async function DELETE() {
    return NextResponse.json({ message: 'DELETE api/session/[id]' });
}
export async function PATCH() {
    return NextResponse.json({ message: 'PATCH api/session/[id]' });
}
