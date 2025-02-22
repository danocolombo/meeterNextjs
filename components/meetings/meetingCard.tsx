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

const isFutureMeeting = (meetingDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meeting = new Date(meetingDate);
    return meeting >= today;
};

export const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
    const isFuture = isFutureMeeting(meeting.meeting_date);
    const cardClasses = `block meetings-list-card ${
        isFuture
            ? 'bg-green-100 dark:bg-green-800'
            : 'bg-cyan-100 dark:bg-gray-700'
    }`;

    return (
        <Link
            href={`/meeting/${meeting.id}`}
            className={cardClasses}
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
