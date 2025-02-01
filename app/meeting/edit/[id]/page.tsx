'use client';
import React from 'react';
import MeetingEditForm from '@/components/meeting/MeetingForm';
import { useUser } from '@clerk/nextjs';

interface PageProps {
    params: {
        id: string;
    };
}

const EditMeetingForm = ({ params }: PageProps) => {
    const { user } = useUser();
    return <MeetingEditForm id={params.id} user={user} />;
};

export default EditMeetingForm;
