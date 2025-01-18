import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        return NextResponse.json({
            message: `GET api/user/[${id}]`,
            cognitoSub: id,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const requestData = await req.json();
    return NextResponse.json({
        message: 'POSt api/user/[id]',
        body: requestData,
    });
}
export async function PUT() {
    return NextResponse.json({ message: 'PUT api/user/[id]' });
}
export async function DELETE() {
    return NextResponse.json({ message: 'DELETE api/user/[id]' });
}
export async function PATCH() {
    return NextResponse.json({ message: 'PATCH api/user/[id]' });
}
