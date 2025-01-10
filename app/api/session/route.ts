import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
}
