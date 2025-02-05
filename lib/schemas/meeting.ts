import { z } from 'zod';

export const meetingFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    meeting_date: z.string().min(1, 'Meeting date is required'),
    meeting_type: z.string().optional(),
    attendance_count: z.number().nullable().optional(),
    facilitator_contact: z.string().optional(),
    support_contact: z.string().optional(),
    meal: z.string().optional(),
    meal_contact: z.string().optional(),
    meal_count: z.number().nullable().optional(),
    notes: z.string().optional(),
});

export type MeetingFormData = z.infer<typeof meetingFormSchema>;
