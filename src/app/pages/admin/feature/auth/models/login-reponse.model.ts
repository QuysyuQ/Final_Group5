export interface LoginRepose {
    token : string;
    refreshToken : string;
    role : string;
    isActive : number;
    expiresAt : string;
}