import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { GroupType } from '@/app/meetings/[id]/page';
import { handleGroupSubmit } from '@/app/actions/meetingActions';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupFormSchema } from '@/lib/schemas/group';
import { GROUP_LOCATION, GENDER_TYPE } from '@/utils/constants';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface GroupsComponentProps {
    group: GroupType;
    isNew: boolean;
    isPending?: boolean;
    onDelete: (id: string) => void;
    onUpdate: (id: string, group: GroupType) => void;
    onValidated: (id: string, group: GroupType) => void;
}

const GroupsComponent = ({
    group,
    isNew,
    isPending,
    onDelete,
    onUpdate,
    onValidated,
}: GroupsComponentProps) => {
    const [showOptionalFields, setShowOptionalFields] = useState(true);
    const form = useForm<GroupType>({
        resolver: zodResolver(groupFormSchema),
        defaultValues: {
            ...group,
            attendance: group.attendance || 0,
        },
    });

    const handleSave = (data: GroupType) => {
        if (isPending) {
            // For pending groups, validate and add to meetingData
            onValidated(group.id!, data);
        } else if (isNew) {
            // For new groups being added
            onValidated(group.id!, data);
        } else {
            // For existing groups, update the meetingData
            onUpdate(group.id!, data);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSave)}>
            <div
                className={`p-4 rounded-lg border ${
                    isNew
                        ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-50'
                        : 'bg-[hsl(var(--form-background))] text-[hsl(var(--form-text))]'
                }`}
            >
                <div className='flex justify-between items-center mb-4'>
                    <div className='text-2xl font-bold text-blue-800 dark:text-blue-400'>
                        Group
                    </div>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => group.id && onDelete?.(group.id)}
                        className='text-red-500 hover:text-red-700 hover:bg-red-100 px-2 py-1 text-sm'
                    >
                        REMOVE
                    </Button>
                </div>
                <FormContainer>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg'>
                        {/* Required Fields */}
                        <FormInput
                            {...form.register('title')}
                            type='text'
                            label='Title *'
                            error={form.formState.errors.title?.message}
                        />

                        <div className='flex flex-col space-y-1.5'>
                            <label htmlFor='location'>Location *</label>
                            <Select
                                onValueChange={(value) =>
                                    form.setValue('location', value)
                                }
                                defaultValue={group.location || undefined}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select location' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(GROUP_LOCATION).map(
                                        (loc) => (
                                            <SelectItem key={loc} value={loc}>
                                                {loc}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex flex-col space-y-1.5'>
                            <label htmlFor='gender'>Gender *</label>
                            <Select
                                onValueChange={(value) =>
                                    form.setValue('gender', value)
                                }
                                defaultValue={group.gender || undefined}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select gender' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(GENDER_TYPE).map(
                                        ([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Optional Fields */}
                        <FormInput
                            {...form.register('attendance', {
                                valueAsNumber: true,
                                value: 0,
                            })}
                            type='number'
                            label='Attendance'
                            defaultValue={0}
                        />

                        <FormInput
                            {...form.register('facilitator')}
                            type='text'
                            label='Facilitator'
                        />

                        <FormInput
                            {...form.register('cofacilitator')}
                            type='text'
                            label='Co-facilitator'
                        />

                        <div className='md:col-span-2'>
                            <FormInput
                                {...form.register('notes')}
                                type='text'
                                label='Notes'
                            />
                        </div>
                    </div>
                </FormContainer>
                <div className='mt-4 flex justify-end'>
                    <Button
                        type='submit'
                        variant='default'
                        disabled={!form.formState.isDirty}
                        className={`w-24 ${
                            form.formState.isDirty
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-gray-300'
                        }`}
                    >
                        {isNew ? 'Save Group' : 'Update Group'}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default GroupsComponent;
