import React, { forwardRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    label?: string;
    error?: string;
    type?: string;
    options?: string[];
}

const FormInput = forwardRef<
    HTMLInputElement | HTMLSelectElement,
    FormInputProps
>(({ label, error, type = 'text', options, className, ...props }, ref) => {
    const inputClasses = `form-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
            file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-muted-foreground focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50 ${
                error ? 'border-red-500' : ''
            } ${className}`;

    return (
        <div className='space-y-1'>
            {label && (
                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    {label}
                </label>
            )}
            {type === 'select' ? (
                <select
                    className={inputClasses}
                    ref={ref as React.RefObject<HTMLSelectElement>}
                    {...props}
                >
                    <option value=''>Select...</option>
                    {options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    className={inputClasses}
                    ref={ref as React.RefObject<HTMLInputElement>}
                    {...props}
                />
            )}
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    );
});

FormInput.displayName = 'FormInput';

export default FormInput;
