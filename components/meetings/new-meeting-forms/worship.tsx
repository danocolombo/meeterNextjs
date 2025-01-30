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

const worshipSchema = newMeetingSchema
    .pick({
        worship: true,
    })
    .transform((data) => ({
        worship: data.worship ?? '',
    }));
type WorshipSchema = z.infer<typeof worshipSchema>;

export default function NewMeetingWorshipForm() {
    const router = useRouter();
    const form = useForm<WorshipSchema>({
        resolver: zodResolver(worshipSchema),
        defaultValues: {
            worship: '',
        },
    });

    const onSubmit = (data: WorshipSchema) => {
        console.log(data);
        router.push('/meeting/new/meal');
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-[300px] space-y-8'
            >
                <FormField
                    control={form.control}
                    name='worship'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Worship</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=''
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormDescription>Worship...</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Next: Meals</Button>
            </form>
        </Form>
    );
}
