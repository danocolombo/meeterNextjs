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

const titleDateTypeSchema = newMeetingSchema.pick({
    title: true,
    meeting_date: true,
    meeting_type: true,
    facilitator_contact: true,
    support_contact: true, // Changed from support_contact1
});
type TitleDateTypeSchema = z.infer<typeof titleDateTypeSchema>;

export default function TitleDateTypeForm() {
    const form = useForm<TitleDateTypeSchema>({
        resolver: zodResolver(titleDateTypeSchema),
        defaultValues: {
            title: '',
            meeting_type: 'TESTIMONY',
            meeting_date: new Date().toISOString().split('T')[0],
            facilitator_contact: '',
            support_contact: '', // Changed from support_contact1
        },
    });

    const onSubmit = (data: TitleDateTypeSchema) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-[300px] space-y-8'
            >
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder='Title' {...field} />
                            </FormControl>
                            <FormDescription>Meeting Title...</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='meeting_date'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meeting Date</FormLabel>
                            <FormControl>
                                <Input
                                    type='date'
                                    placeholder='date'
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormDescription>Meeting date...</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='meeting_type'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meeting Type</FormLabel>
                            <FormControl>
                                <Input placeholder='meeting type' {...field} />
                            </FormControl>
                            <FormDescription>Meeting type...</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='facilitator_contact'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Facilitator</FormLabel>
                            <FormControl>
                                <Input placeholder='Facilitator' {...field} />
                            </FormControl>
                            <FormDescription>Facilitator...</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='support_contact'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Support Contact</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Support contact'
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormDescription>
                                Support contact...
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>Next</Button>
            </form>
        </Form>
    );
}
