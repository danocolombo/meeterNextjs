import React from 'react';

interface AdminAttributeProps {
    title: string;
    value: string | number | boolean | null | undefined;
    className?: string;
}

export const AdminAttribute: React.FC<AdminAttributeProps> = ({
    title,
    value,
    className = '',
}) => {
    const displayValue =
        value === null || value === undefined
            ? ''
            : typeof value === 'boolean'
            ? value.toString()
            : value;

    return (
        <div className={className}>
            {title}: <span className='font-bold'>{displayValue}</span>
        </div>
    );
};

export default AdminAttribute;
