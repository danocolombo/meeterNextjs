/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const responseData = 'YES';

        return NextResponse.json({
            message: `GET api/session`,
            response: responseData,
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

//* =========================================================

//import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//     try {
//         const requestData = await req.json();
//         return NextResponse.json({
//             message: 'POSt api/user/[id]',
//             body: requestData,
//         });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// export async function POST(request: Request) {
//     const body = await request.json();
//     return NextResponse.json({ success: true, data: body });
// }
