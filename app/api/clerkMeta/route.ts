import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { printObject } from '@/utils/helpers';

export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                {
                    status: 422,
                    message: 'User not authenticated',
                    data: null,
                },
                { status: 422 }
            );
        }

        const metadata = {
            publicMetadata: user.publicMetadata,
            privateMetadata: user.privateMetadata,
        };

        return NextResponse.json({
            status: 200,
            message: 'Success',
            data: metadata,
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 500,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Internal server error',
                data: null,
            },
            { status: 500 }
        );
    }
}
