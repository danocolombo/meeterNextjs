import { NextResponse } from 'next/server';
import axios from 'axios';
import { type PUT_DATA, type DB_DATA } from './types';
import { type MeetingType } from '@/utils/types';
import { MEETING_TYPE } from '@/utils/constants';

export async function POST(request: Request) {
    const body = await request.json();

    console.log('🟨 => route.ts:10 => POST body:', body);

    // Process the received data (e.g., save to database)

    return NextResponse.json({
        status: 200,
        message: 'Meeting POST saved successfully',
        data: { id: 'tbd' },
    });
}
//* =================================================================================================
//* PUT --- Update a meeting, and groups if provided.
//* =================================================================================================

export async function PUT(request: Request) {
    const putMeeting = await request.json();

    const putData: PUT_DATA = {
        meeting: {
            id: putMeeting.id,
            action: null,
        },
        groups: [],
    };
    if (putMeeting.groups) {
        putData.groups = putMeeting.groups.map((group: any, index: number) => {
            return {
                id: group?.id ? group?.id : index.toString(),
                action: group?.id ? null : 'POST',
            };
        });
    }

    // console.log('🟨 => route.ts:43 => PUT putMeeting:', putMeeting);
    // console.log('🟨 => route.ts:44 => putData:', putData);

    //=================================================================================================
    // get the meeting from the database
    //=================================================================================================
    let dbMeeting: any | null = null;
    try {
        const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting/${putMeeting.organizationId}/${putMeeting.id}`;
        const response = await axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${putMeeting.apiToken}`,
            },
        });
        let dbResponse: any = null;
        if (response?.data?.status === 200) {
            dbResponse = response.data.data;
            dbMeeting = { ...dbResponse };
        } else {
            throw new Error('Failed to fetch meeting data');
        }
    } catch (error: any) {
        console.log('🟨 => route.ts:66 => CATCH:', error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'An error occurred';
        return NextResponse.json({
            status: 500,
            message: errorMessage,
            data: { id: null },
        });
    }

    //=================================================================================================
    // set the DB_DATA
    //=================================================================================================
    // console.log('🟨 => route.ts:81 => dbMeeting:', dbMeeting);
    const dbData: DB_DATA = {
        groups: [],
    };
    if (dbMeeting?.groups) {
        dbData.groups = dbMeeting?.groups.map((group: any) => {
            return {
                id: group?.id,
                action: null,
            };
        });
    }

    // check if the meeting has changed
    //* =================================================================================================
    //* putCompare definition
    //* =================================================================================================
    let putCompare: any = { ...putMeeting };
    delete putCompare.groups;
    delete putCompare.organizationId;
    delete putCompare.apiToken;

    // Convert empty strings and zeros to null
    Object.keys(putCompare).forEach((key) => {
        if (putCompare[key] === '' || putCompare[key] === 0) {
            putCompare[key] = null;
        }
    });

    //* =================================================================================================
    //* dbCompare definition
    //* =================================================================================================
    let dbCompare: any = { ...dbMeeting };
    delete dbCompare.groups;

    //* =================================================================================================
    //* compare putCompare and dbCompare
    //* =================================================================================================
    // console.log('🟨 => route.ts:119 => putCompare:', putCompare);
    // console.log('🟨 => route.ts:120 => dbCompare:', dbCompare);
    const hasChanges = Object.keys(putCompare).some(
        (key) =>
            JSON.stringify(putCompare[key]) !== JSON.stringify(dbCompare[key])
    );
    putData.meeting.action = hasChanges ? 'PUT' : null;
    console.log('🟨 => route.ts:126 => hasChanges:', hasChanges);
    // console.log('🟨 => route.ts:127 => putData:', putData);
    // console.log('🟨 => route.ts:128 => dbData:', dbData);

    //=================================================================================================
    // CHECK GROUPS NOW
    //=================================================================================================
    // no putMeeting.groups, mark any dbMeeting.groups for deletion
    if (putMeeting.groups.length === 0 && dbMeeting.groups) {
        dbData.groups = dbMeeting.groups.map((group) => ({
            id: group.id,
            action: 'DELETE',
        }));
    } else if (dbMeeting.groups.length === 0 && putMeeting.groups.length > 0) {
        putData.groups = putMeeting.groups.map((group: any, index: number) => ({
            id: group?.id ? group?.id : index.toString(),
            action: group?.id ? null : 'POST',
        }));
    } else {
        // check for groups to update
        putData.groups = putMeeting.groups.map(
            (putGroup: any, index: number) => {
                // get group from dbMeeting
                const dbGroup = dbMeeting.groups.find(
                    (group: any) => group.id === putGroup.id
                );
                if (!dbGroup) {
                    return {
                        id: putGroup.id,
                        action: 'POST',
                    };
                }
                const hasGroupChanges = Object.keys(putGroup).some(
                    (key) =>
                        JSON.stringify(putGroup[key]) !==
                        JSON.stringify(dbGroup[key])
                );
                return {
                    id: putGroup.id,
                    action: hasGroupChanges ? 'PUT' : null,
                };
            }
        );

        // check for groups to delete
        dbData.groups = dbMeeting.groups.map((dbGroup: any) => {
            const putGroup = putMeeting.groups.find(
                (group: any) => group.id === dbGroup.id
            );
            if (!putGroup) {
                return {
                    id: dbGroup.id,
                    action: 'DELETE',
                };
            }
            return {
                id: dbGroup.id,
                action: null,
            };
        });
    }

    console.log('🟨 => route.ts:146 => putData:', putData);
    console.log('🟨 => route.ts:147 => dbData:', dbData);
    return NextResponse.json({
        status: 200,
        message: 'Meeting PUT saved successfully',
        data: { id: 'tbd' },
    });
}
