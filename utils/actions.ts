'use server';
import { redirect } from 'next/navigation';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import {
    imageSchema,
    meetingSchema,
    profileSchema,
    propertySchema,
    validateWithZodSchema,
} from './schemas';
import db from './db';
import { revalidatePath } from 'next/cache';

import { uploadImage } from './supabase';

const renderError = (error: unknown): { message: string } => {
    console.log(error);
    return {
        message: error instanceof Error ? error.message : 'An error occurred',
    };
};
//helper function to get the current user
const getAuthUser = async () => {
    const user = await currentUser();
    if (!user) {
        throw new Error('You must be logged in to access this route');
    }
    if (!user.privateMetadata.hasProfile) redirect('/profile/create');
    return user;
};

export const createProfileAction = async (
    prevState: any,
    formData: FormData
) => {
    try {
        const user = await currentUser();

        if (!user) throw new Error('Please login to create a profile');

        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(profileSchema, rawData);
        await db.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ...validatedFields,
            },
        });
        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true,
                status: 'INITIATED',
            },
        });
    } catch (error) {
        // return {
        //     message:
        //         error instanceof Error
        //             ? error.message
        //             : 'failure in createProfileAction',
        // };
        return renderError(error);
    }
    redirect('/');
};
export const fetchProfileImage = async () => {
    const user = await currentUser();
    if (!user) return null;

    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        },
        select: {
            profileImage: true,
        },
    });

    return profile?.profileImage;
};
export const fetchProfile = async () => {
    //this checks if the user is logged in
    const user = await getAuthUser();
    // now get the user from the database
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        },
    });
    if (!profile) redirect('/profile/create');
    return profile;
};
export const updateProfileAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();

    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(profileSchema, rawData);

        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: validatedFields,
        });

        revalidatePath('/profile');
        return { message: 'Profile updated successfully' };
    } catch (error) {
        return renderError(error);
    }
};

export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const image = formData.get('image') as File;
        const validatedFields = validateWithZodSchema(imageSchema, { image });
        const fullPath = await uploadImage(validatedFields.image);
        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: {
                profileImage: fullPath,
            },
        });
        revalidatePath('/profile');
        return { message: 'Profile image updated successfully' };
    } catch (error) {
        return renderError(error);
    }
};

export const createPropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(propertySchema, rawData);
        return { message: 'Property created successfully' };
    } catch (error) {
        return renderError(error);
    }
    // redirect('/');
};
export const createMeetingAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        console.log('rawData\n', rawData);
        const validatedFields = validateWithZodSchema(meetingSchema, rawData);
        console.log('validatedFields\n', validatedFields);
        return { message: 'GOOD' };
        // return { message: 'Meeting created successfully' };
    } catch (error) {
        return renderError(error);
    }
    // redirect('/');
};
/*
// printObject('MAPI:209->meeting:', meeting);
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
        try {
            //********************************
            //* POST database call
            //********************************
            const endPoint = process.env.EXPO_PUBLIC_JERICHO_ENDPOINT;
            const config = {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Authorization: `Bearer ${apiToken}`,
                },
            };
            const orgId = meeting.organization_id;
            const body = JSON.stringify(snake_meeting);
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
                    console.error('MAPI:231 meetings API call failed:', error);
                    const customError: ApiError = {
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
            console.log('MAPI:286-->error:', error);
            console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
        }
*/
