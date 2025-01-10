// Define the session payload structure
export interface SessionPayloadType {
    userId: string;
    username?: string;
    userEmail?: string;
    clerkId?: string;
    cognitoSub?: string;
    meeterUserRole?: string;
    meeterClientId?: string;
    cognitoToken?: string;
    jerichoToken?: string;
    expiresAt?: Date;
}
