import { NextResponse } from 'next/server';
import axios from 'axios';
export async function GET(
    req: Request,
    { params }: { params: { org: string } }
) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;
        const hardCodedBaseUrl = 'https://fortsonguru.com/jericho/public/api';
        const { org } = await params;
        const apiToken = req.headers.get('jerichoToken');

        if (!apiToken) {
            return NextResponse.json({
                status: 401,
                message: 'No authorization token provided',
            });
        }

        const { data: jerichoResponseData } = await axios.get(
            `${hardCodedBaseUrl}/meetings/${org}`,
            {
                params: { direction: 'desc' },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiToken}`,
                },
            }
        );

        console.log('GET:33-->jerichoResponseData:\n', jerichoResponseData);

        if (jerichoResponseData.status !== 200) {
            return NextResponse.json({
                status: jerichoResponseData.status,
                message: `ERROR: no meetings found for ${org}.`,
                data: jerichoResponseData,
            });
        }

        return NextResponse.json({
            status: jerichoResponseData.status,
            message: `POST response for org meetings ${org}`,
            data: jerichoResponseData.data,
        });
    } catch (error: any) {
        // Axios error handling
        if (axios.isAxiosError(error)) {
            console.error('GET:50-->axios error:\n', error);
            return NextResponse.json(
                { error: error.response?.data || error.message },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
