export const transformMeetingFormData = (meeting: any) => {
    return {
        ...meeting,
        attendance_count: meeting.attendance_count ?? 0,
        meal_count: meeting.meal_count ?? 0,
        newcomers_count: meeting.newcomers_count ?? 0,
    };
};
