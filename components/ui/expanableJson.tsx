import React, { useState } from 'react';

interface ExpandableJsonProps {
    data: any;
    title?: string;
}

const ExpandableJson: React.FC<ExpandableJsonProps> = ({
    data,
    title = 'JSON Data',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className='mt-4 border rounded-lg p-2 dark:border-gray-700'>
            <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold dark:text-gray-200'>
                    {title}
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors dark:text-gray-200'
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>
            {isExpanded && (
                <pre className='mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded overflow-auto dark:text-gray-200'>
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default ExpandableJson;
