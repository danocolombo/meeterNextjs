import { getMetaAction, storeMetaAction } from '@/utils/clerk';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET() {
//     return NextResponse.json({ message: 'Hello api/users/meta' });
// }
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const params: { [key: string]: string } = {};

    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    const response = {
        message: 'Hello api/users/meta',
        ...(Object.keys(params).length > 0 && { params }),
    };

    return NextResponse.json(response);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { clerkId, apiToken } = body;
    const metaTestResponse = await storeMetaAction(null, { clerkId, apiToken });
    const getMetaResponse = await getMetaAction(null, {
        clerkId,
    });
    return NextResponse.json({
        metaResponseData: metaTestResponse,
        privateMetadata: getMetaResponse.data.metaData,
    });
}
