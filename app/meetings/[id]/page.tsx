import GroupsComponent from '@/components/groups/page';
import MeetingForm from '@/components/meetings/meetingForm';
import { Group } from 'lucide-react';
import React from 'react';
export type MeetingType = {
    id?: string | null;
    created_at?: string | null; // Assuming format is compatible with Date
    updated_at?: string | null;
    meeting_date?: string | null; // Assuming format is compatible with Date
    title?: string | null;
    meeting_type?: string | null;
    mtg_comp_key?: string | null;
    announcements_contact?: string | null;
    attendance_count?: number | null;
    av_contact?: string | null;
    cafe_contact?: string | null;
    cafe_count?: number | null;
    children_contact?: string | null;
    children_count?: number | null;
    cleanup_contact?: string | null;
    closing_contact?: string | null;
    donations?: number | null;
    facilitator_contact?: string | null;
    greeter_contact1?: string | null;
    greeter_contact2?: string | null;
    meal?: string | null;
    meal_contact?: string | null;
    meal_count?: number | null;
    newcomers_count?: number | null;
    notes?: string | null;
    nursery_contact?: string | null;
    nursery_count?: number | null;
    resource_contact?: string | null;
    security_contact?: string | null;
    setup_contact?: string | null;
    support_contact?: string | null;
    transportation_contact?: string | null;
    transportation_count?: number | null;
    worship?: string | null;
    youth_contact?: string | null;
    youth_count?: number | null;
    organization_id?: string | null;
    groups?: GroupType[]; // Changed from [GroupType] to GroupType[]
};
export type GroupType = {
    id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    meeting_date?: string | null;
    grp_comp_key?: string | null;
    title?: string | null;
    location?: string | null;
    gender?: string | null;
    attendance?: number | null;
    facilitator?: string | null;
    notes?: string | null;
    meeting_id?: string | null;
    organization_id?: string | null;
    cofacilitator?: string | null;
};
const meeting: MeetingType = {
    id: 'f0aa6943-b2c8-47b4-b55a-83f59b5a7811',
    created_at: '2024-10-01T08:57:02.000000Z',
    updated_at: '2024-11-18T20:04:42.000000Z',
    meeting_date: '2024-11-11',
    title: '22 - Gratitude',
    meeting_type: 'Lesson',
    mtg_comp_key: 'WBC#2024#11#11',
    announcements_contact: null,
    attendance_count: 39,
    av_contact: null,
    cafe_contact: null,
    cafe_count: null,
    children_contact: null,
    children_count: null,
    cleanup_contact: null,
    closing_contact: null,
    donations: null,
    facilitator_contact: null,
    greeter_contact1: null,
    greeter_contact2: null,
    meal: 'Pizza (19)',
    meal_contact: 'Bubba',
    meal_count: 36,
    newcomers_count: null,
    notes: null,
    nursery_contact: null,
    nursery_count: null,
    resource_contact: null,
    security_contact: null,
    setup_contact: null,
    support_contact: 'Rob',
    transportation_contact: null,
    transportation_count: null,
    worship: null,
    youth_contact: null,
    youth_count: null,
    organization_id: '067da614-c220-404b-a3d2-66abb9897155',
    groups: [
        {
            id: '469a2583-1b37-4bbb-ae67-0b86f3c2a2dc',
            created_at: '2024-11-18T20:07:22.000000Z',
            updated_at: '2024-11-18T20:07:22.000000Z',
            meeting_date: '2024-11-11',
            grp_comp_key: 'WBC#2024#11#11#f0aa6943-b2c8-47b4-b55a-83f59b5a7811',
            title: 'A-Z',
            location: 'Left 4',
            gender: 'm',
            attendance: 6,
            facilitator: null,
            cofacilitator: null,
            notes: null,
            meeting_id: 'f0aa6943-b2c8-47b4-b55a-83f59b5a7811',
            organization_id: null,
        },
        {
            id: '9305f011-c8e8-4a7c-8ba8-5ec169c723e7',
            created_at: '2024-11-18T20:06:35.000000Z',
            meeting_date: '2024-11-11',
            grp_comp_key: 'WBC#2024#11#11#f0aa6943-b2c8-47b4-b55a-83f59b5a7811',
            title: 'Teen Challenge',
            location: 'Right 2',
            gender: 'f',
            attendance: 9,
            facilitator: null,
            cofacilitator: null,
            notes: null,
            meeting_id: 'f0aa6943-b2c8-47b4-b55a-83f59b5a7811',
            organization_id: null,
        },
    ],
};

interface PageProps {
    params: {
        id: string;
    };
}

const MeetingPage = ({ params }: PageProps) => {
    // For now, we'll use the hardcoded meeting if its id matches,
    // otherwise return null or some placeholder
    // const displayMeeting = meeting.id === params.id ? meeting : null;
    const displayMeeting = meeting;
    if (!displayMeeting) {
        return <div>Meeting not found</div>;
    }

    return (
        <div className='space-y-8'>
            <MeetingForm meeting={displayMeeting} />
            <div className='grid gap-4'>
                {displayMeeting.groups?.map((group) => (
                    <GroupsComponent key={group.id} group={group} />
                ))}
            </div>
        </div>
    );
};

export default MeetingPage;
