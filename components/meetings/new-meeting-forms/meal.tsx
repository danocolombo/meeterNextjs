'use client';
import React from 'react';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { newMeetingSchema } from '@/features/meeting/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const mealSchema = newMeetingSchema
    .pick({
        meal: true,
        meal_contact: true,
        meal_count: true,
    })
    .transform((data) => ({
        meal: data.meal ?? '',
        meal_contact: data.meal_contact ?? '',
        meal_count: data.meal_count ?? 0,
    }));
type MealSchema = z.infer<typeof mealSchema>;

export default function NewMeetingMealForm() {
    const router = useRouter();
    const form = useForm<MealSchema>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            meal: '',
            meal_contact: '',
            meal_count: 0,
        },
    });

    const onSubmit = (data: MealSchema) => {
        console.log(data);
        router.push('/meeting/new/confirm');
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-[300px] space-y-8'
            >
                <FormField
                    control={form.control}
                    name='meal'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meal</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=''
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormDescription>
                                What was on the menu ??
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='meal_contact'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meal Contact</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=''
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormDescription>
                                Who was responsible for meal ??
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='meal_count'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meals Served</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=''
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Review</Button>
            </form>
        </Form>
    );
}
