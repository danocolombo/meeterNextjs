import { z } from 'zod';

export const groupFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    location: z.string().min(1, 'Location is required'),
    gender: z.string().min(1, 'Gender is required'),
    // Allow other fields but make them optional
    attendance: z.number().optional().nullable(),
    facilitator: z.string().optional().nullable(),
    cofacilitator: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

export type GroupFormData = z.infer<typeof groupFormSchema>;
