import { getClerkUsers, getMetaAction, storeMetaAction } from '@/utils/clerk';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET() {
//     return NextResponse.json({ message: 'Hello api/users/meta' });
// }
export async function GET() {
    const userList = await getClerkUsers();
    const response = {
        message: 'GET api/admin/clerk/users/',
        userList,
    };

    return NextResponse.json(response);
}

// export async function POST(request: Request) {
//     const body = await request.json();
//     const { clerkId, status, apiToken, userProfile } = body;
//     const storeMetaResponse: any = await storeMetaAction(null, {
//         clerkId,
//         status,
//         apiToken,
//         userProfile,
//     });
//     const getMetaResponse: any = await getMetaAction(null, {
//         clerkId,
//     });

//     if (storeMetaResponse.data.status !== 200) {
//         return NextResponse.json({
//             status: 500,
//             message: 'Error storing meta [aaum:33]',
//             response: storeMetaResponse,
//         });
//     }

//     return NextResponse.json({
//         status: 200,
//         storeMetaResponse: storeMetaResponse,
//         privateMetadata: getMetaResponse.data.metaData,
//     });
// }
