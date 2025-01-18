'use server';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
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
): Promise<{ message: string }> => {
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
        return { message: 'Profile updated successfully' };
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
): Promise<{ message: string }> => {
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
        return { message: 'Profile image updated successfully' };
    } catch (error) {
        return renderError(error);
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

//   ================================================================
//   LOCAL: common error handler
//   ================================================================
const renderError = (error: unknown): { message: string } => {
    console.log(error);
    return {
        message: error instanceof Error ? error.message : 'An error occurred',
    };
};
