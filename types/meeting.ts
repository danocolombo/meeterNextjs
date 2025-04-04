export const MEETING_TYPE = {
    LESSON: 'Lesson',
    TESTIMONY: 'Testimony',
    SPECIAL: 'Special',
} as const;

export type MeetingType = (typeof MEETING_TYPE)[keyof typeof MEETING_TYPE];
