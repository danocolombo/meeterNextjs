import { NextResponse } from 'next/server';
import axios from 'axios';
import { type PUT_DATA, type DB_DATA } from '../types';
import { type MeetingType } from '@/utils/types';
import { MEETING_TYPE } from '@/utils/constants';
import { printObject } from '@/utils/helpers';

//* =================================================================================================
//* PUT --- Update a meeting, and groups if provided.
//* =================================================================================================
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    let DEV = true;
    const platformValue = process.env.NEXT_PUBLIC_MEETER_PLATFORM || 'DEV';
    if (platformValue === 'PROD') {
        DEV = false;
    }
    const { id } = params;
    // get the body of the PUT to process
    const meeting = await request.json();
    // export async function PUT(request: Request) {
    // const meeting = await request.json();
    // DEV ? console.log('111111111111111111111111111111111111') : null;
    // console.log('🟨 => api/meeting/[id]/route.ts:14 => PUT [id]]:', id);
    // console.log('🟨 => api/meeting/[id]/route.ts:28 => PUT meeting:\n', meeting);
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
    if (meeting?.groups.length > 0) {
        putData.groups = meeting.groups.map((group: any, index: number) => {
            return {
                id: group?.id ? group?.id : index.toString(),
                action: group?.id.startsWith('PENDING_') ? 'POST' : null,
            };
        });
    }
    if (DEV) {
        // console.log('🟨 => route.ts:49 => PUT meeting:', meeting);
        // console.log('🟨 => route.ts:50 => putData:', putData);
    }
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
            if (DEV) {
                const error = new Error('Failed to fetch meeting data from db');
                (error as any).statusCode = response?.data?.status || 500;
                (error as any).endpoint = endpoint || '';
                (error as any).response = response || '';
                throw error;
            } else {
                const error = new Error(
                    'Failed to retrieve meeting definition'
                );
                (error as any).statusCode = response?.data?.status || 500;
                throw error;
            }
        }
    } catch (error: any) {
        if (DEV) {
            console.log('🟨 => route.ts:85 => CATCH error:\n', error);
            return NextResponse.json(error);
        } else {
            return NextResponse.json({
                status: 500,
                message: error.message,
                data: {},
            });
        }
    }

    //=================================================================================================
    // set the DB_DATA
    //=================================================================================================
    // DEV ? console.log('🟨 => route.ts:81 => dbMeeting:', dbMeeting) : null;
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
    // DEV ? {
    //     console.log('🟨 => route.ts:125 => putCompare:', putCompare);
    //     console.log('🟨 => route.ts:126 => dbCompare:', dbCompare);
    // }:null
    const hasChanges = Object.keys(putCompare).some(
        (key) =>
            JSON.stringify(putCompare[key]) !== JSON.stringify(dbCompare[key])
    );
    putData.meeting.action = hasChanges ? 'PUT' : null;
    // DEV ? {
    //     console.log('🟨 => route.ts:132 => hasChanges:', hasChanges);
    //     console.log('🟨 => route.ts:133 => putData:', putData);
    //     console.log('🟨 => route.ts:134 => dbData:', dbData);
    // }:null;
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
                    DEV
                        ? console.log(
                            '🟨 DELETE group URL:\n',
                            response.config.url
                        )
                        : null;
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
                    DEV
                        ? console.log(
                            '🟨 => api/meeting/route.ts:231 => group POST detected:',
                            group.action
                        )
                        : null;
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
                            grp_comp_key: `${meeting.mtg_comp_key.split('#')[0]
                                }#${meeting.id}`,
                            meeting_id: meeting.id,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${bearerToken}`,
                        },
                    }).then((response) => {
                        DEV
                            ? console.log(
                                '🟨 PUT group URL:\n',
                                response.config.url
                            )
                            : null;
                        return response;
                    });
                } else if (group.action === 'PUT') {
                    DEV
                        ? console.log(
                            '🟨 => api/meeting/route.ts:262 => group PUT detected:',
                            group.action
                        )
                        : null;
                    let grp = meeting.groups.find(
                        (g: any) => g.id === group.id
                    );
                    if (grp.id.startsWith('PENDING_')) {
                        delete grp.id;
                    }
                    DEV ? console.log('GO-GO-GO') : null;
                    return axios({
                        // Add return here
                        method: 'PUT',
                        url: `${baseUrl}/api/jericho/group/${grp.id}`,
                        data: {
                            ...grp,
                            grp_comp_key: `${meeting.mtg_comp_key.split('#')[0]
                                }#${meeting.id}`,
                            meeting_id: meeting.id,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${bearerToken}`,
                        },
                    }).then((response) => {
                        DEV ? console.log('BACK-BACK-BACK') : null;
                        if (response.status === 200) {
                            const responseValues = {
                                status: response.status,
                                data: response.data.data,
                            };
                            DEV
                                ? printObject(
                                    `🟨 200 PUT group responseValues:\n`,
                                    responseValues
                                )
                                : null;
                            return response;
                        }
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
    let responseValues: any = {};
    if (putData.meeting.action === 'PUT') {
        // DEV
        //     ? console.log(
        //           '🟨 api/meeting/[id]/route --- 22222222222222222222222222'
        //       )
        //     : null;
        // DEV ? printObject('🟨 GOING:', meeting) : null;
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        try {
            const response = await axios({
                method: 'PUT',
                url: `${baseUrl}/api/jericho/meeting/${meeting.id}`,
                data: {
                    ...meeting,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
            });
            DEV ? printObject(`🟨 api/meeting/${meeting.id}/route.ts:375:\n`, response) : null;
            responseValues = {
                status: response.status,
                data: response.data,
            };
            if (DEV) {
                printObject(
                    `🟨 PUT => api/meeting/${meeting.id}/route.ts:382 => responseValues:`,
                    responseValues
                );
            }
        } catch (error: any) {
            let errorResponse = {
                status: 500,
                message: 'Failed to update meeting',
                error,
            };
            if (DEV) {
            }
            return NextResponse.json(
                {
                    message: DEV
                        ? 'Failed to update meeting'
                        : 'Failed to update meeting',
                    data: DEV
                        ? {
                            error: 'api/meeting PUT failure',
                            meetingReceived: meeting,
                            apiToken: bearerToken,
                        }
                        : {},
                },
                { status: error?.status || 500 }
            );

            // return NextResponse.json(
            //     { error: 'Failed to update meeting' },
            //     { status: 500 }
            // );
        }
    }

    // Always return a response, whether there were changes or not
    const returnValue = {
        message: 'Meeting updated successfully',
        data: responseValues.data,
        status: responseValues.status,
    };

    DEV
        ? printObject(
            `🟨 PUT => api/meeting/${meeting.id}/route.ts:340 => returnValue:`,
            returnValue
        )
        : null;

    return NextResponse.json(returnValue);
}
