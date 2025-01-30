import { z } from 'zod';
import { MEETING_TYPE, GROUP_LOCATION, GENDER_TYPE } from '@/utils/constants';

export const groupSchema = z.object({
    id: z.string().max(36).nullable(),
    meeting_date: z.string().nullish(),
    title: z.string().min(3).max(50),
    gender: z.enum(Object.values(GENDER_TYPE) as [string, ...string[]]),
    location: z.enum(Object.values(GROUP_LOCATION) as [string, ...string[]]),
    attendance: z.number().int().min(0).max(20),
    facilitator: z.string().max(50).nullish(),
    cofacilitator: z.string().max(50).nullish(),
    notes: z.string().max(100).nullish(),
});

export const newMeetingSchema = z.object({
    id: z.string().max(36).nullish(),
    title: z.string().min(4).max(50),
    meeting_date: z.string().nullish(),
    meeting_type: z.enum(Object.values(MEETING_TYPE) as [string, ...string[]]),
    facilitator_contact: z.string().max(50).nullish(),
    support_contact: z.string().max(50).nullish(),
    worship: z.string().max(50).nullish(),
    meal: z.string().max(50).nullish(),
    meal_count: z.number().int().positive(),
    meal_contact: z.string().max(50).nullish(),
    notes: z.string().max(100).nullish(),
    groups: z.array(groupSchema).optional(),
});

export type NewMeetingSchema = z.infer<typeof newMeetingSchema>;
export type GroupSchema = z.infer<typeof groupSchema>;
