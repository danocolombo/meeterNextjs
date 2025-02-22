import Link from 'next/link';
import { MeetingType } from '@/app/meetings/[id]/page';

export default function ButtHeadMeetingsList({
    meetings,
}: {
    meetings: MeetingType[];
}) {
    return (
        <div className='grid gap-4'>
            {meetings.map((meeting) => (
                <Link
                    href={`/meetings/${meeting.id}`}
                    key={meeting.id}
                    className='p-4 border rounded-lg hover:bg-gray-50'
                >
                    <div className='flex justify-between items-center'>
                        <h3 className='font-medium'>{meeting.title}</h3>
                        <span>{meeting.meeting_date}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
