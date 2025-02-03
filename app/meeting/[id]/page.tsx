'use client';

import GroupsComponent from '@/components/groups/page';
import MeetingFormSkeleton from '@/components/skeletons/MeetingFormSkeleton';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Group } from 'lucide-react';
import React from 'react';
import { printObject } from '@/utils/helpers';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import MeetingForm from '@/components/meeting/MeetingForm';

interface PageProps {
    params: {
        id: string;
    };
}

const MeetingPage = ({ params }: PageProps) => {
    return (
        <div className='space-y-8'>
            <MeetingForm id={params.id} />
        </div>
    );
};

export default MeetingPage;
