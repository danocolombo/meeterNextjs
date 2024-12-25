import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
    // firstName: z.string().max(5, { message: 'max length is 5' }),
    firstName: z
        .string()
        .min(2, {
            message: 'first name must be at least 2 characters',
        })
        .max(10),
    lastName: z.string().min(2, {
        message: 'last name must be at least 2 characters',
    }),
    username: z.string().min(2, {
        message: 'username must be at least 2 characters',
    }),
});

export function validateWithZodSchema<T>(
    schema: ZodSchema<T>,
    data: unknown
): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = result.error.errors.map((error) => error.message);
        throw new Error(errors.join('; '));
    }
    return result.data;
}

export const imageSchema = z.object({
    image: validateFile(),
});

function validateFile() {
    const maxUploadSize = 1024 * 1024;
    const acceptedFilesTypes = ['image/'];
    return z
        .instanceof(typeof File !== 'undefined' ? File : Object)
        .refine((file) => {
            return !file || file?.size <= maxUploadSize;
        }, 'File size must be less than 1 MB')
        .refine((file) => {
            return (
                !file ||
                acceptedFilesTypes.some((type) => file?.type?.startsWith(type))
            );
        }, 'File must be an image');
}

export const propertySchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'name must be at least 2 characters.',
        })
        .max(100, {
            message: 'name must be less than 100 characters.',
        }),
    tagline: z
        .string()
        .min(2, {
            message: 'tagline must be at least 2 characters.',
        })
        .max(100, {
            message: 'tagline must be less than 100 characters.',
        }),
    price: z.coerce.number().int().min(0, {
        message: 'price must be a positive number.',
    }),
    category: z.string(),
    description: z.string().refine(
        (description) => {
            const wordCount = description.split(' ').length;
            return wordCount >= 10 && wordCount <= 1000;
        },
        {
            message: 'description must be between 10 and 1000 words.',
        }
    ),
    country: z.string(),
    guests: z.coerce.number().int().min(0, {
        message: 'guest amount must be a positive number.',
    }),
    bedrooms: z.coerce.number().int().min(0, {
        message: 'bedrooms amount must be a positive number.',
    }),
    beds: z.coerce.number().int().min(0, {
        message: 'beds amount must be a positive number.',
    }),
    baths: z.coerce.number().int().min(0, {
        message: 'bahts amount must be a positive number.',
    }),
    amenities: z.string(),
});
export const meetingSchema = z
    .object({
        title: z
            .string()
            .min(2, {
                message: 'Title must be at least 2 characters.',
            })
            .max(50, {
                message: 'Title must be less than 50 characters.',
            }),
        worship: z
            .string()
            .nullable()
            .or(z.literal(''))
            .refine(
                (worship) =>
                    worship === null ||
                    worship === '' ||
                    (worship.length >= 2 && worship.length <= 50),
                {
                    message:
                        'Worship identifier must be null, empty, or between 2 and 50 characters.',
                }
            ),
        support_contact: z
            .string()
            .nullable()
            .or(z.literal(''))
            .refine(
                (support_contact) =>
                    support_contact === null ||
                    support_contact === '' ||
                    (support_contact.length >= 2 &&
                        support_contact.length <= 50),
                {
                    message:
                        'Contact must be null, empty, or between 2 and 50 characters.',
                }
            ),
        meal: z
            .string()
            .nullable()
            .or(z.literal(''))
            .refine(
                (meal) =>
                    meal === null ||
                    meal === '' ||
                    (meal.length >= 2 && meal.length <= 50),
                {
                    message:
                        'Meal description must be null, empty, or between 2 and 50 characters.',
                }
            ),
        meal_contact: z
            .string()
            .nullable()
            .or(z.literal(''))
            .refine(
                (meal) =>
                    meal === null ||
                    meal === '' ||
                    (meal.length >= 2 && meal.length <= 50),
                {
                    message:
                        'Meal provider must be null, empty, or between 2 and 50 characters.',
                }
            ),
        meal_count: z.coerce.number().int().min(0, {
            message: 'Meals served must be a positive number.',
        }),
        meeting_type: z.string(),
        notes: z
            .string()
            .nullable()
            .or(z.literal(''))
            .refine(
                (notes) =>
                    notes === null ||
                    notes === '' ||
                    (notes.length >= 2 && notes.length <= 50),
                {
                    message:
                        'Notes must be null, empty, or between 2 words and 100 characters.',
                }
            ),
        attendance_count: z.coerce.number().int().min(0, {
            message: 'attendance value must be a positive number.',
        }),
        newcomers_count: z.coerce.number().int().min(0, {
            message: 'newcomers value must be a positive number.',
        }),
    })
    .refine((data) => data.newcomers_count <= data.attendance_count, {
        message:
            'Newcomers count must be less than or equal to attendance count.',
        path: ['newcomers_count'],
    });

// export const createReviewSchema = z.object({
//     propertyId: z.string(),
//     rating: z.coerce.number().int().min(1).max(5),
//     comment: z.string().min(10).max(1000),
// });
