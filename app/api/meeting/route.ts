import { NextResponse } from 'next/server';
import axios from 'axios';
import { type PUT_DATA, type DB_DATA } from './types';
import { type MeetingType } from '@/utils/types';
import { MEETING_TYPE } from '@/utils/constants';
import { printObject } from '@/utils/helpers';

export async function POST(request: Request) {
    const body = await request.json();

    console.log('🟨 => route.ts:11 => POST body:', body);

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
    const meeting = await request.json();
    console.log('111111111111111111111111111111111111');
    console.log('🟨 => api/meeting/route.ts:28 => PUT meeting:\n', meeting);
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');
    // console.log('🟨 => route.ts:32 => bearerToken:', bearerToken);

    const putData: PUT_DATA = {
        meeting: {
            id: meeting.id,
            action: null,
        },
        groups: [],
    };
    if (meeting.groups.length > 0) {
        putData.groups = meeting.groups.map((group: any, index: number) => {
            return {
                id: group?.id ? group?.id : index.toString(),
                action: group?.id.startsWith('PENDING_') ? 'POST' : null,
            };
        });
    }
    // console.log('🟨 => route.ts:49 => PUT meeting:', meeting);
    // console.log('🟨 => route.ts:50 => putData:', putData);

    //=================================================================================================
    // get the meeting from the database
    //=================================================================================================
    let dbMeeting: any | null = null;
    try {
        const endpoint = `${process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT}/meeting/${meeting.organization_id}/${meeting.id}`;
        const response = await axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
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
        console.log('🟨 => route.ts:72 => CATCH:', error);
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
    // console.log('🟨 => route.ts:87 => dbMeeting:', dbMeeting);
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
    let putCompare: any = { ...meeting };
    delete putCompare.groups;
    // delete putCompare.organizationId;
    // delete putCompare.apiToken;

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
    // console.log('🟨 => route.ts:125 => putCompare:', putCompare);
    // console.log('🟨 => route.ts:126 => dbCompare:', dbCompare);
    const hasChanges = Object.keys(putCompare).some(
        (key) =>
            JSON.stringify(putCompare[key]) !== JSON.stringify(dbCompare[key])
    );
    putData.meeting.action = hasChanges ? 'PUT' : null;
    // console.log('🟨 => route.ts:132 => hasChanges:', hasChanges);
    // console.log('🟨 => route.ts:133 => putData:', putData);
    // console.log('🟨 => route.ts:134 => dbData:', dbData);

    //=================================================================================================
    // CHECK GROUPS NOW
    //=================================================================================================
    // no meeting.groups, mark any dbMeeting.groups for deletion
    if (meeting.groups.length === 0 && dbMeeting.groups) {
        dbData.groups = dbMeeting.groups.map((group: any) => ({
            id: group.id,
            action: 'DELETE',
        }));
    } else if (dbMeeting.groups.length === 0 && meeting.groups.length > 0) {
        putData.groups = meeting.groups.map((group: any, index: number) => ({
            id: group?.id,
            action: 'POST',
        }));
    } else {
        // check for groups to update
        putData.groups = meeting.groups.map((putGroup: any, index: number) => {
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
        });

        // check for groups to delete
        dbData.groups = dbMeeting.groups.map((dbGroup: any) => {
            const putGroup = meeting.groups.find(
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

    // console.log('🟨 => route.ts:192 => putData:', putData);
    // console.log('🟨 => route.ts:193 => dbData:', dbData);
    //* =================================================================================================
    //* Work the putData and dbData
    //* =================================================================================================
    // process dbData first, delete all groups that have active === 'DELETE'
    if (dbData.groups.length > 0) {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const deletePromises = dbData.groups
            .filter((group) => group.action === 'DELETE')
            .map((group) =>
                axios({
                    method: 'DELETE',
                    url: `${baseUrl}/api/jericho/group/${group.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${bearerToken}`,
                    },
                }).then((response) => {
                    console.log('🟨 DELETE group URL:\n', response.config.url);
                    return response;
                })
            );

        try {
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error deleting groups:', error);
            return NextResponse.json({
                status: 500,
                message: 'Error deleting groups',
                error,
            });
        }
    }
    // process putData, loop through groups, if action === 'POST', POST group
    if (putData.groups.length > 0) {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const putPromises = putData.groups
            .filter((group) => group.action !== null)
            .map((group) => {
                if (group.action === 'POST') {
                    console.log('🟨 api/meeting/route --- POST detected');
                    console.log('------------------------------------------');
                    let grp = meeting.groups.find(
                        (g: any) => g.id === group.id
                    );
                    if (grp.id.startsWith('PENDING_')) {
                        delete grp.id;
                    }
                    return axios({
                        // Add return here
                        method: 'POST',
                        url: `${baseUrl}/api/jericho/group`,
                        data: {
                            ...grp,
                            grp_comp_key: `${
                                meeting.mtg_comp_key.split('#')[0]
                            }#${meeting.id}`,
                            meeting_id: meeting.id,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${bearerToken}`,
                        },
                    }).then((response) => {
                        console.log('🟨 PUT group URL:\n', response.config.url);
                        return response;
                    });
                } else if (group.action === 'PUT') {
                    console.log('🟨 api/meeting/route --- PUT detected');
                    console.log('------------------------------------------');
                    let grp = meeting.groups.find(
                        (g: any) => g.id === group.id
                    );
                    if (grp.id.startsWith('PENDING_')) {
                        delete grp.id;
                    }
                    //todo: move API to api/jericho/group/[id]
                    return axios({
                        // Add return here
                        method: 'PUT',
                        url: `${baseUrl}/api/jericho/group`,
                        data: {
                            ...grp,
                            grp_comp_key: `${
                                meeting.mtg_comp_key.split('#')[0]
                            }#${meeting.id}`,
                            meeting_id: meeting.id,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${bearerToken}`,
                        },
                    }).then((response) => {
                        console.log('🟨 PUT group URL:\n', response.config.url);
                        return response;
                    });
                }
                return Promise.resolve(); // Handle cases where no action is needed
            });

        try {
            await Promise.all(putPromises.filter(Boolean)); // Filter out undefined promises
        } catch (error) {
            console.error('Error updating groups:', error);
            return NextResponse.json({
                status: 500,
                message: 'Error updating groups',
                error,
            });
        }
    }
    // process putData, if action === 'PUT', PUT meeting
    if (putData.meeting.action === 'PUT') {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        return axios({
            // Add return here
            method: 'PUT',
            url: `${baseUrl}/api/jericho/meeting/${meeting.id}`,
            data: {
                ...putData.meeting,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
        }).then((response) => {
            // console.log('🟨 PUT meeting response:\n', response);
            const responseValues = {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
            };

            return responseValues;
        });
    }
    console.log('##############################################');
    console.log('############# api/meeting DONE  ##############');
    console.log('##############################################');
    return NextResponse.json({
        status: 200,
        message: 'Meeting PUT saved successfully',
        data: { id: 'tbd' },
    });
}
