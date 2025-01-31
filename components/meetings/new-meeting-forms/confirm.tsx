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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MEETING_TYPE } from '@/utils/constants';

const confirmSchema = newMeetingSchema.pick({
    title: true,
    meeting_date: true,
    meeting_type: true,
    facilitator_contact: true,
    support_contact: true,
    attendance_count: true,
    worship: true,
    meal: true,
    meal_count: true,
    meal_contact: true,
    notes: true,
});
type ConfirmSchema = z.infer<typeof confirmSchema>;

export default function NewMeetingConfirmForm() {
    const router = useRouter();
    const form = useForm<ConfirmSchema>({
        resolver: zodResolver(confirmSchema),
        defaultValues: {
            title: '',
            meeting_type: 'TESTIMONY',
            meeting_date: new Date().toISOString().split('T')[0],
            facilitator_contact: '',
            support_contact: '', // Changed from support_contact1
            attendance_count: 0,
        },
    });
    const meetingType = form.watch('meeting_type');
    const onSubmit = (data: ConfirmSchema) => {
        console.log(data);
        // router.push('/meeting/new/worship');
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-[300px] space-y-8'
            >
                <div className='flex flex-col sm:flex-row sm:gap-4 space-y-6 sm:space-y-0'>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Title' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Meeting Title...
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1'>
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
                                    <FormDescription>
                                        Meeting date...
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row sm:gap-4 space-y-6 sm:space-y-0'>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='meeting_type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meeting Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select meeting type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(
                                                    MEETING_TYPE
                                                ).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Meeting type...
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='support_contact'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {meetingType === 'LESSON'
                                            ? 'Instructor'
                                            : ['TESTIMONY', 'SPECIAL'].includes(
                                                  meetingType
                                              )
                                            ? 'Guest(s)'
                                            : 'Support Contact'}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                meetingType === 'LESSON'
                                                    ? 'Instructor'
                                                    : [
                                                          'TESTIMONY',
                                                          'SPECIAL',
                                                      ].includes(meetingType)
                                                    ? 'Guest(s)'
                                                    : 'Support contact'
                                            }
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {meetingType === 'LESSON'
                                            ? 'Instructor...'
                                            : ['TESTIMONY', 'SPECIAL'].includes(
                                                  meetingType
                                              )
                                            ? 'Guest(s)...'
                                            : 'Support contact...'}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row sm:gap-4 space-y-6 sm:space-y-0'>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='facilitator_contact'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facilitator</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Facilitator'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Facilitator...
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='attendance_count'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Attendance</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={0}
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Attendance count...
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
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
                <Button type='submit'>Save New Meeting</Button>
            </form>
        </Form>
    );
}
