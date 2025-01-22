'use server';
import { redirect } from 'next/navigation';
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
import { getAuthUser } from './jericho';
const renderError = (error: unknown): { message: string } => {
    console.log(error);
    return {
        message: error instanceof Error ? error.message : 'An error occurred',
    };
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
        const results: any = await createNewMeeting(meeting);
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

export const updateProfileAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);

        const validatedFields = profileSchema.parse(rawData);

        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: validatedFields,
        });
        revalidatePath('/profile');
        return { message: 'Profile updated successfully' };
    } catch (error) {
        return {
            message:
                error instanceof Error ? error.message : 'An error occurred',
        };
    }
};
export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    return { message: 'Profile image updated successfully' };
};
