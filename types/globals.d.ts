export {};

// Create a type for the roles
export type Roles =
    | 'admin'
    | 'owner'
    | 'manager'
    | 'meals'
    | 'groups'
    | 'groups-meals'
    | 'cofacilitator'
    | 'visitor';

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}
