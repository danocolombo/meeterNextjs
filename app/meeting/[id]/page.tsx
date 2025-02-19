'use client';

import GroupsComponent from '@/components/groups/GroupForm';
import MeetingFormSkeleton from '@/components/skeletons/MeetingFormSkeleton';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Group } from 'lucide-react';
import React from 'react';
import { printObject } from '@/utils/helpers';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import MeetingForm from '@/components/meeting/MeetingForm';
import { useToast } from '@/hooks/use-toast';

interface PageProps {
    params: {
        id: string;
    };
}

const MeetingPage = ({ params }: PageProps) => {
    const { toast } = useToast();
    const showToast = async (message: string, type: string) => {
        toast({
            description: message,
            variant: type === 'error' ? 'destructive' : 'default',
        });
    };

    return (
        <div className='space-y-8'>
            <MeetingForm id={params.id} showToast={showToast} />
        </div>
    );
};

export default MeetingPage;
