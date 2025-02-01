import React, { useState, useEffect } from 'react';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import { GroupType } from '@/app/meetings/[id]/page';
import { handleGroupSubmit } from '@/app/actions/meetingActions';
import { Button } from '@/components/ui/button';

interface GroupsComponentProps {
    group: GroupType;
    isNew?: boolean;
    onDelete?: (groupId: string) => void;
    onUpdate?: (groupId: string, updatedGroup: GroupType) => void;
}

const GroupsComponent = ({
    group,
    isNew,
    onDelete,
    onUpdate,
}: GroupsComponentProps) => {
    const [isChanged, setIsChanged] = useState(false);
    const [formData, setFormData] = useState<GroupType>(group);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let processedValue: string | number | null = value;

        // Handle number fields
        if (name === 'attendance') {
            processedValue = value === '' ? null : Number(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));
        setIsChanged(true);
    };

    // Reset form data when group prop changes
    useEffect(() => {
        setFormData(group);
        setIsChanged(false);
    }, [group]);

    const handleUpdate = () => {
        if (onUpdate && group.id) {
            onUpdate(group.id, formData);
            setIsChanged(false);
        }
    };

    return (
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
            <FormContainer action={handleGroupSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg'>
                    <FormInput
                        name='title'
                        type='text'
                        className='form-input'
                        defaultValue={formData.title || ''}
                        label='Title'
                        onChange={handleInputChange}
                    />
                    <FormInput
                        name='location'
                        type='text'
                        defaultValue={formData.location || ''}
                        label='Location'
                        onChange={handleInputChange}
                    />
                    <FormInput
                        name='gender'
                        type='text'
                        defaultValue={formData.gender || ''}
                        label='Gender'
                        onChange={handleInputChange}
                    />
                    <FormInput
                        name='attendance'
                        type='number'
                        defaultValue={formData.attendance?.toString()}
                        label='Attendance'
                        onChange={handleInputChange}
                    />
                    <FormInput
                        name='facilitator'
                        type='text'
                        defaultValue={formData.facilitator || ''}
                        label='Facilitator'
                        onChange={handleInputChange}
                    />
                    <FormInput
                        name='cofacilitator'
                        type='text'
                        defaultValue={formData.cofacilitator || ''}
                        label='Co-facilitator'
                        onChange={handleInputChange}
                    />
                    <div className='md:col-span-2'>
                        <FormInput
                            name='notes'
                            type='text'
                            defaultValue={formData.notes || ''}
                            label='Notes'
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </FormContainer>
            <div className='mt-4 flex justify-end'>
                <Button
                    type='button'
                    variant='default'
                    onClick={handleUpdate}
                    disabled={!isChanged}
                    className={`w-24 ${
                        isChanged
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-300'
                    }`}
                >
                    {isChanged ? 'Update' : 'Updated'}
                </Button>
            </div>
        </div>
    );
};

export default GroupsComponent;
