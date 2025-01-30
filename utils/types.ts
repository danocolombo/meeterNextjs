import { Group } from 'lucide-react';
import { GROUP_LOCATION, MEETING_TYPE, GENDER_TYPE } from '@/utils/constants';

export type actionFunction = (
    prevState: any,
    formData: FormData
) => Promise<{ message: string }>;

export interface ApiError {
    status: number;
    message: string;
    details: string;
}

export type MeetingType = {
    name: string;
    date?: string;
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
    aws_id?: string | null;
    aws_org_id?: string | null;
    groups?: [GroupType];
};
export type GroupType = {
    id: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    meeting_date: string | null;
    grp_comp_key: string | null;
    title: string | null;
    location: string;
    gender: string;
    attendance: number | null;
    facilitator: string | null;
    notes: string | null;
    meeting_id: string | null;
    organization_id: string | null;
    aws_id?: string | null;
    aws_org_id?: string | null;
    cofacilitator?: string | null;
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

export type AffiliationType = {
    id: string | null;
    organizationId: string | null;
    role: string | null;
    status: string | null;
};

// Define the session payload structure
export interface UserProfileType {
    clerkId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    jerichoId?: string;
    jerichoSub?: string;
    defaultOrgId?: string;
    orgId?: string | null;
    orgCode?: string | null;
    orgName?: string | null;
    orgRole?: string | null;
    roles: string[];
    cognitoToken?: string;
    jerichoToken?: string;
    asOf?: Date;
}
export interface IronSessionData {
    apiToken?: string;
}
export interface ClerkUserType {
    id?: string | null;
    passwordEnabled?: Boolean | null;
    totpEnabled?: Boolean | null;
    backupCodeEnabled?: Boolean | null;
    twoFactorEnabled?: Boolean | null;
    banned?: Boolean | null;
    createdAt?: number | null;
    updatedAt?: number | null;
    imageUrl?: string | null;
    hasImage?: Boolean | null;
    primaryEmailAddressId?: string | null;
    primaryPhoneNumberId?: string | null;
    primaryWeb3WalletId?: string | null;
    lastSignInAt?: number | null;
    externalId?: string | null;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    publicMetadata?: any;
    privateMetadata?: any;
    unsafeMetadata?: any;
    emailAddresses?: any[] | null;
    phoneNumbers?: [] | null;
    web3Wallets?: [] | null;
    externalAccounts?: [] | null;
    samlAccounts?: [] | null;
    lastActiveAt?: number | null;
    createOrganizationEnabled?: Boolean | null;
}
export function MeetingTypeEnum(
    MeetingTypeEnum: any
): import('zod').ZodNativeEnum<any> {
    throw new Error('Function not implemented.');
}
