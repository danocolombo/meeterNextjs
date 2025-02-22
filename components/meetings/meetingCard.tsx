import Link from 'next/link';
import MeetingCardGroup from './meetingCardGroup';

interface Meeting {
    id: string;
    meeting_date: string;
    title: string;
    meeting_type: string;
    support_contact: string | null;
    groups: Array<{
        id: string;
        title: string;
        location: string;
        facilitator: string;
    }>;
}

export const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
    return (
        <Link
            href={`/meeting/${meeting.id}`}
            className='block meetings-list-card'
            aria-label={`View meeting: ${meeting.title}`}
        >
            <h3 className='font-bold'>
                {meeting.title}
                {meeting.meeting_type === 'Lesson' &&
                    meeting.support_contact !== null &&
                    ` - ${meeting.support_contact}`}
            </h3>
            <p>{meeting.meeting_date}</p>

            {meeting.groups.length > 0 && (
                <p>Groups: {meeting.groups.length}</p>
            )}
            {meeting.groups.length > 0 &&
                meeting.groups.map((group) => (
                    <MeetingCardGroup key={group.id} group={group} />
                ))}
        </Link>
    );
};

export default MeetingCard;
