import axios from 'axios';
import { ApiError, MeetingType } from '@/utils/types';
import { currentUser } from '@clerk/nextjs/server';

export const createMeeting = async (meeting: MeetingType) => {
    try {
        const response = await axios.post('/meetings', meeting);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
};

export async function createNewMeeting(
    meeting: MeetingType
): Promise<{ status: number; data: MeetingType | any } | ApiError> {
    return new Promise(async (resolve, reject) => {
        async function fetchCurrentUser() {
            const user: any = await currentUser();
            return user;
        }
        const user: any = await fetchCurrentUser();
        function convertKeysToSnakeCase(obj) {
            const newObj = {};
            for (const key in obj) {
                const newKey = key
                    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
                    .toLowerCase();
                newObj[newKey] = obj[key];
            }
            return newObj;
        }
        const snake_meeting = convertKeysToSnakeCase(meeting);
        const final_meeting = {
            ...snake_meeting,
            organization_id: user?.privateMetadata?.organization.id,
        };
        console.log('M:45-->final_meeting:\n', final_meeting);
        try {
            //********************************
            //* POST database call
            //********************************
            const endPoint = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;
            const token = process.env.NEXT_PUBLIC_JERICHO_API_KEY;
            const config = {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Authorization: `Bearer ${token}`,
                },
            };
            const orgId = meeting.organization_id;
            const body = JSON.stringify(final_meeting);
            const api2use = endPoint + '/meeting';
            axios
                .post(api2use, body, config)
                .then((response) => {
                    if (response.status === 200) {
                        const savedMeeting = response?.data?.data;

                        const returnMessage = {
                            status: response.status,
                            data: savedMeeting,
                        };
                        resolve(returnMessage);
                    } else {
                        const returnMessage = {
                            status: response.status,
                            data: response.data.message,
                        };
                        reject(returnMessage);
                    }
                })
                .catch((error) => {
                    console.error('PM:63 meetings API call failed:', error);
                    const customError: any = {
                        message: 'Failure creating meetings.',
                        details: {
                            // More specific error details based on the actual error response
                            ...(error.response && error.response.data),
                        },
                    };
                    reject(customError);
                });
        } catch (error) {
            console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
            console.log('M:86-->error:', error);
            console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
        }
    });
}
