import { printObject } from '@/utils/helpers';
import { NextResponse } from 'next/server';

export async function POST(
    request: any,

    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const body = await request.json();
    const { apiToken } = body;
    //* ------------------------------------------------
    //* attempt to get Jericho profile for user
    //* ------------------------------------------------
    try {
        const baseUrl = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;
        const jerichoResponse: any = await fetch(`${baseUrl}/person/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiToken}`,
            },
        });

        const jerichoResponseData = await jerichoResponse.json();
        if (jerichoResponseData.status != 200) {
            printObject(
                '🥖 AAU[id]R:29 /person/id jerichoResponse != 200:\n',
                jerichoResponseData
            );
            return NextResponse.json({
                status: jerichoResponseData.status,
                message: `ERROR: no profile found for ${id}. ${body}`,
                data: jerichoResponseData,
            });
        }
        if (jerichoResponseData.status === 200) {
            return NextResponse.json({
                status: jerichoResponseData.status,
                message: `POST response for user ${id}`,
                data: jerichoResponseData.data,
            });
        }
    } catch (error: any) {
        printObject(
            '🥖 AAU[id]R:47 /person/id jerichoResponse catch error:\n',
            error
        );
        return NextResponse.json({ status: 500, error: error.message });
    }
}

// export async function POST(req: Request) {
//     const requestData = await req.json();
//     return NextResponse.json({
//         message: 'POSt api/user/[id]',
//         body: requestData,
//     });
// }
// export async function PUT() {
//     return NextResponse.json({ message: 'PUT api/user/[id]' });
// }
// export async function DELETE() {
//     return NextResponse.json({ message: 'DELETE api/user/[id]' });
// }
// export async function PATCH() {
//     return NextResponse.json({ message: 'PATCH api/user/[id]' });
// }
