import axios from 'axios';
import { JerichoUserType } from '@/utils/types';

export async function fetchJerichoUser(
    email: string
): Promise<JerichoUserType | { ApiError: any }> {
    return new Promise(async (resolve, reject) => {
        try {
            //********************************
            //* GET (search) database call
            //********************************
            const endPoint = process.env.NEXT_PUBLIC_JERICHO_API_ENDPOINT;
            const token = process.env.NEXT_PUBLIC_JERICHO_API_KEY;

            const api2use = endPoint + '/people/search?email=' + email;
            axios
                .get(api2use, {
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    // console.log('PU:25-->response:\n', response);
                    if (response.data.status === 200) {
                        const returnedUsers = response.data.data.data;
                        if (returnedUsers.length > 0) {
                            const theUser = returnedUsers[0];
                            const returnValue: JerichoUserType = {
                                jericho_id: theUser.id,
                                created_at: theUser.created_at,
                                cognito_sub: theUser.sub,
                                username: theUser.username,
                                first_name: theUser.first_name,
                                last_name: theUser.last_name,
                                email: theUser.email,
                                default_org_id: theUser?.default_org_id as
                                    | string
                                    | '',
                            };
                            resolve(returnValue);
                        }
                    } else {
                        const customError: any = {
                            message: 'Failure getting Jericho user.',
                            details: {
                                // More specific error details based on the actual error response
                                ...response.data.data,
                            },
                        };
                        reject(customError);
                    }
                })
                .catch((error) => {
                    console.error('PU:58 call failed:', error);
                    const customError: any = {
                        message: 'Failure getting active meetings.',
                        details: {
                            // More specific error details based on the actual error response
                            ...(error.response && error.response.data),
                        },
                    };
                    reject(customError);
                });
        } catch (error) {
            console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
            console.log('PU:70-->error:', error);
            console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
        }
    });
}
