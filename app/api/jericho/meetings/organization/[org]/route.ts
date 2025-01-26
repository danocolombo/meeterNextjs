import { NextResponse } from 'next/server';
import axios from 'axios';
import { printObject } from '@/utils/helpers';
export async function GET(
    req: Request,
    { params }: { params: { org: string } }
) {
    // console.log('GET request received for organization:', params.org);

    try {
        const jerichoToken = String(req.headers.get('jerichoToken'));
        const hardCodedBaseUrl = 'https://fortsonguru.com/jericho/public/api';
        const { org } = params;

        // Use the known working token
        // const token = '2|L717ylnkKOWrh6kE08DNXtIGAJiqDLVwC4y6v2wS79d6b80c';
        const token = '1359|cFhgm9hLWUyvee9SeuFjoWBeWI7woYCgh3wvQBeh9004cd2b';
        printObject('🔲🔲🔲 GET:16-->jerichoToken:\n', jerichoToken);
        console.log(
            '🔲🔲🔲 GET:16-->type of jerichoToken:\n',
            typeof jerichoToken
        );
        console.log('🔲🔲🔲 GET:17-->token:\n', token);
        console.log('🔲🔲🔲 GET:18-->type of token:\n', typeof token);

        const response = await axios({
            method: 'get',
            url: `${hardCodedBaseUrl}/meetings/${org}`,
            params: { direction: 'desc' },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jerichoToken}`,
            },
        });

        // Validate response data structure
        const responseData = response.data;
        const meetings: any = responseData.data.data;
        // printObject('🥎🥎🥎 meetings:\n', meetings);
        const paginationData: any = response.data;
        delete paginationData.data.data;
        // printObject('🥎🥎🥎 paginationData:\n', paginationData);
        // Extract pagination information
        // const pagination = {
        //     current_page: responseData.data.current_page,
        //     total_pages: responseData.data.last_page,
        //     per_page: responseData.data.per_page,
        //     total: responseData.data.total,
        // };
        const returnInformation = {
            status: 200,
            message: 'Success',
            data: meetings,
            paginationData,
        };
        printObject('🥎🥎🥎 returnInformation:\n', returnInformation);
        return NextResponse.json(returnInformation);
        // return NextResponse.json({
        //     status: 200,
        //     message: 'Success',
        //     data: meetings, // Ensure we're sending an array
        //     paginationData,
        // });
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Full error response:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                requestHeaders: error.config?.headers,
                responseHeaders: error.response?.headers,
            });

            return NextResponse.json(
                {
                    error: 'Authentication failed with the external API',
                    details: error.response?.data,
                },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
