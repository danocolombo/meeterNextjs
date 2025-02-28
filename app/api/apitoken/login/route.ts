import { printObject } from '@/utils/helpers';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    return NextResponse.json({ message: 'Hello World' });
}

export async function POST(req: Request) {
    //* ------------------------------------------------
    //* attempt to get Jericho api token for user
    //* ------------------------------------------------
    try {
        const baseUrl = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;
        const { id, email } = await req.json();

        const { data: jerichoResponseData } = await axios.post(
            `${baseUrl}/login`,
            {
                email,
                sub: id,
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        printObject('🥖🥖🥖 jerichoResponse:\n', jerichoResponseData);

        if (jerichoResponseData.status !== 200) {
            printObject(
                '🥖 AAALR:35 /login jerichoResponse != 200:\n',
                jerichoResponseData
            );
            throw new Error(
                jerichoResponseData.message || 'Failed to get API token'
            );
        }
        const returnValues = {
            status: jerichoResponseData.status,
            message: `POST response from jericho: api/apitoken/login`,
            request: { id, email },
            data: jerichoResponseData,
            apiToken: jerichoResponseData.token.plainTextToken,
        };
        printObject('🥖🥖🥖 returnValues:\n', returnValues);
        return NextResponse.json(returnValues);
    } catch (error: any) {
        printObject('🥖 AAALR:53 GET /apitoken/login catch error\n', error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'An error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
