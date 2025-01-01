export type actionFunction = (
    prevState: any,
    formData: FormData
) => Promise<{ message: string }>;

export interface ApiError {
    status: number;
    message: string;
    details: string;
}
export type MeetingTypeEnum = 'Testimony' | 'Lesson' | 'Special' | 'Other';
export type MeetingType = {
    id?: string | null;
    created_at?: string | null; // Assuming format is compatible with Date
    updated_at?: string | null;
    meeting_date?: string | null; // Assuming format is compatible with Date
    title?: string | null;
    meeting_type?: MeetingTypeEnum | null; // Define enum for meeting types (e.g., "Testimony", "Worship")
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
    aws_id?: string | null;
    aws_org_id?: string | null;
    groups?: [GroupType];
};
export type GroupType = {
    id: string | null;
    created_at: string | null;
    updated_at: string | null;
    meeting_date: string | null;
    grp_comp_key: string | null;
    title: string | null;
    location: string | null;
    gender: string | null;
    attendance: number | null;
    facilitator: string | null;
    notes: string | null;
    meeting_id: string | null;
    organization_id: string | null;
    aws_id: string | null;
    aws_org_id: string | null;
    cofacilitator: string | null;
};

export type JerichoUserType = {
    jericho_id: string | null; // id
    created_at: string | null;
    updated_at?: string | null;
    cognito_sub: string | null; // sub
    username: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email: string | null;
    default_org_id?: string | null;
};
