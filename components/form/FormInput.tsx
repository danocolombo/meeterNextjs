import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormInputProps {
    name: string;
    type: string;
    label?: string;
    defaultValue?: string;
    readOnly?: boolean;
    placeholder?: string;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
    name,
    type,
    label,
    defaultValue,
    readOnly = false,
    placeholder,
    required = true,
    onChange,
}: FormInputProps) => {
    return (
        <div className='mb-2'>
            <Label htmlFor={name} className='capitalize'>
                {label || name}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={readOnly}
                required={required}
                onChange={onChange}
            />
            {readOnly && (
                <input type='hidden' name={name} value={defaultValue} />
            )}
        </div>
    );
};

export default FormInput;
