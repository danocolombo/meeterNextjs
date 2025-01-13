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
import { createMeeting, createNewMeeting } from '@/providers/meetings';
import { JerichoUserType, MeetingType } from './types';

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
    //* looking to see if there is a meeter definition in
    //* the privateMetadata object
    // if (!user.privateMetadata.hasProfile) redirect('/profile/create');
    if (!user.privateMetadata.hasProfile) redirect('/test');
    return user;
};
export const createProfileAction = async (
    prevState: any,
    formData: FormData,
    jerichoUser?: any
) => {
    try {
        const user = await currentUser();
        if (!user) throw new Error('Please login to create a profile');
        const rawData = Object.fromEntries(formData);
        console.log('++++++++++++++++++++++++++++++++++++++++++++');
        console.log('Form Data:', rawData);
        if (jerichoUser) {
            console.log('Jericho User:', jerichoUser);
        }
        console.log('++++++++++++++++++++++++++++++++++++++++++++');

        const validatedFields = validateWithZodSchema(profileSchema, rawData);
        console.log('validatedFields\n', validatedFields);

        // await db.profile.create({
        //     data: {
        //         clerkId: user.id,
        //         email: user.emailAddresses[0].emailAddress,
        //         profileImage: user.imageUrl ?? '',
        //         ...validatedFields,
        //     },
        // });
        // await clerkClient.users.updateUserMetadata(user.id, {
        //     privateMetadata: {
        //         hasProfile: true,
        //     },
        // });
        return {
            ...prevState,
            message: 'Profile created successfully!',
        };
    } catch (error) {
        return renderError(error);
    }
    redirect('/');
};
export const createProfileActionWED = async (
    prevState: any,
    formData: FormData,
    jerichoUser: JerichoUserType
) => {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) throw new Error('Please login to create a profile');

        const rawData = Object.fromEntries(formData);
        console.log('++++++++++++++++++++++++++++++++++++++++++++');
        console.log('rawData\n', rawData);
        console.log('++++++++++++++++++++++++++++++++++++++++++++');
        console.log('jerichoUser\n', jerichoUser);
        console.log('++++++++++++++++++++++++++++++++++++++++++++');
        // const validatedFields = validateWithZodSchema(profileSchema, rawData);
        // //=========================================================
        // // define the organization and user role to save in clerk db
        // //=========================================================
        // const orgId = process.env.MEETER_ORGANIZATION_ID;
        // const orgName = process.env.MEETER_ORGANIZATION_NAME;
        // const orgCode = process.env.MEETER_ORGANIZATION_CODE;
        // const userRole = process.env.MEETER_USER_ROLE;
        // await db.profile.create({
        //     data: {
        //         clerkId: user.id,
        //         email: user.emailAddresses[0].emailAddress,
        //         profileImage: user.imageUrl ?? '',
        //         ...validatedFields,
        //     },
        // });
        // await clerkClient.users.updateUserMetadata(user.id, {
        //     privateMetadata: {
        //         hasProfile: false,
        //         status: 'INITIATED',
        //         organization: {
        //             id: orgId,
        //             name: orgName,
        //             code: orgCode,
        //             role: userRole,
        //         },
        //     },
        // });
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

    // if (!profile) redirect('/profile/create');
    if (!profile) redirect('/test');
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
        const mType = validatedFields!.meeting_type || 'Other';
        const meeting: MeetingType = {
            ...validatedFields,
            meeting_type: mType,
        };
        console.log('meeting\n', meeting);
        const results: { status: any; data: any } = await createNewMeeting(
            meeting
        );
        return { message: 'Meeting created successfully' };
    } catch (error) {
        return renderError(error);
    }
    // redirect('/');
};
export const checkJerichoUser1 = async (email: string) => {
    const user = {
        email: email,
        hasJericho: false,
    };
    return { message: 'Jericho user checked successfully' };
};

export const checkJerichoUser = async (
    email: string
): Promise<JerichoUserType> => {
    const user: JerichoUserType = {
        jericho_id: '1234',
        created_at: '2021-09-01',
        updated_at: '2021-09-01',
        cognito_sub: '1234',
        username: 'jdoe',
        first_name: 'John',
        last_name: 'Doe',
        email: email,
        default_org_id: '1234',
    };
    return user;
};
