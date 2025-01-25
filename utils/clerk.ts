'use server';
import { redirect } from 'next/navigation';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { printObject } from '@/utils/helpers';
import { JerichoUserType, MeetingType } from './types';
import { uploadImage } from './supabase';
import {
    imageSchema,
    meetingSchema,
    profileSchema,
    propertySchema,
    validateWithZodSchema,
} from './schemas';
import db from './db';
import { getAuthUser } from './jericho';
import { request } from 'http';

//   ================================================================
//   PROVIDE IMAGE TO UserIcon in NavBar
//   ================================================================
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

//   ================================================================
//   PROVIDE profile to app/profile page
//   ================================================================
export const fetchProfile = async () => {
    //this checks if the user is logged in
    const user: any = await getAuthUser();
    // now get the user from the database
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        },
    });

    if (!profile) redirect('/profile/create');
    // if (!profile) redirect('/test');
    return profile;
};

//   ================================================================
//   PROVIDE ability to update profile from app/profile page
//   ================================================================
export const updateProfileAction = async (
    prevState: any,
    formData: FormData
): Promise<{ data: any }> => {
    const user: any = await getAuthUser();

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
        return { data: 'Profile updated successfully' };
    } catch (error) {
        return renderError(error);
    }
};

//   ================================================================
//   PROVIDE ability to update profile image from app/profile page
//   ================================================================
export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ data: any }> => {
    const user: any = await getAuthUser();
    try {
        const image = formData.get('image') as File;
        const validatedFields: any = validateWithZodSchema(imageSchema, {
            image,
        });
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
        return { data: 'Profile image updated successfully' };
    } catch (error) {
        return renderError(error);
    }
};
//   ================================================================
//   PROVIDE ability to store meta variable from app/profile page
//   ================================================================
export const storeMetaAction = async (
    prevState: any,
    requestData: any
): Promise<{ data: any }> => {
    try {
        const client = await clerkClient;
        const { clerkId, apiToken, status, userProfile } = requestData;
        await client.users.updateUserMetadata(clerkId, {
            privateMetadata: {
                clerkId: clerkId,
                status: status,
                meeter: {
                    apiToken: apiToken,
                    ...userProfile,
                },
            },
        });
        return {
            data: {
                status: 200,
                message: 'storeMetaAction successfully called',
            },
        };
    } catch (error) {
        return {
            data: {
                status: 500,
                message: 'storeMetaAction failure [uc:137]',
            },
        };
    }
};
//   ================================================================
//   PROVIDE ability to get meta data
//   ================================================================
export const getMetaAction = async (
    prevState: any,
    requestData: any
): Promise<{ data: any }> => {
    const { clerkId } = requestData;
    const client = await clerkClient;

    const user = await client.users.getUser(clerkId);

    return {
        data: {
            status: 200,
            message: 'getMetaAction successfully called',
            metaData: user.privateMetadata,
        },
    };
};

//   ================================================================
//   PROVIDE list of users in the clerk system (for admin use)
//   ================================================================
export const getClerkUsers = async (): Promise<{ data: any }> => {
    const userListResponse = await clerkClient.users.getUserList();

    return {
        data: {
            status: 200,
            message: 'getMetaAction successfully called',
            userList: userListResponse,
        },
    };
};
//   ================================================================
//   Provide clerk object for specific clerk id
//   ================================================================
export const getClerkUser = async (id: string): Promise<any> => {
    try {
        const response = await clerkClient.users.getUser(id);
        return {
            status: 200,
            clerkId: id,
            data: JSON.parse(JSON.stringify(response)), // Ensure plain object
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Failed to fetch user',
            error: JSON.parse(JSON.stringify(error)), // Ensure plain object
        };
    }
};

//   ================================================================
//*  ================================================================
//todo:  this is sample to use for updating values. DELETE B4 PROD
//*  ================================================================
//   ================================================================
export const createPropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ data: any }> => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(propertySchema, rawData);
        return { data: 'Property created successfully' };
    } catch (error) {
        return renderError(error);
    }
    // redirect('/');
};

//   ================================================================
//   LOCAL: common error handler
//   ================================================================
const renderError = (error: unknown): { data: string } => {
    console.log(error);
    return {
        data: error instanceof Error ? error.message : 'An error occurred',
    };
};
