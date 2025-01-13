export default interface AuthUser {
    uid: string;
    displayName: string | null;
    email: string | null;
}

export interface actionProps {
    action: (user: AuthUser)=>void
}
