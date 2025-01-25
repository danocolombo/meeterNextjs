import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { org: string } }
) {
    try {
        console.log('org\n', params.org);

        return NextResponse.json({
            message: `GET api/jericho/meetings/org/[${params.org}]`,
            data: params,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
