import React from 'react';
import { Label } from '@/components/ui/label';
import { meetingTypes } from '@/utils/meetingTypes';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const name = 'type';
function MeetingTypeSelectInput({ defaultValue }: { defaultValue?: string }) {
    return (
        <div className='mb-2'>
            <Label htmlFor={name} className='capitalize'>
                Meeting Type
            </Label>
            <Select
                defaultValue={defaultValue || meetingTypes[0].label}
                name={name}
                required
            >
                <SelectTrigger id={name}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {meetingTypes.map((item) => {
                        return (
                            <SelectItem key={item.label} value={item.label}>
                                <span className='flex items-center gap-2'>
                                    <item.icon /> {item.label}
                                </span>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
export default MeetingTypeSelectInput;
