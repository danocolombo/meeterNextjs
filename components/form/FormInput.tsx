import React, { forwardRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    labelClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, labelClassName, ...props }, ref) => {
        return (
            <div className='form-group'>
                <label className={labelClassName}>{label}</label>
                <input
                    ref={ref}
                    {...props}
                    className={`form-input ${error ? 'border-red-500' : ''} ${
                        props.className || ''
                    }`}
                />
                {error && <span className='text-red-500 text-sm'>{error}</span>}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
