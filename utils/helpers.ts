import React from 'react';

export const formattedCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    return formattedDate.toString;
};
export function printObject(label, target) {
    console.log(label, JSON.stringify(target, null, 2));
}
