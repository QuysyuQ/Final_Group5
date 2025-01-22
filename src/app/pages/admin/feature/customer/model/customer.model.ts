export interface customerResponse {
    isActive : number;
    address : string;
    fullName : string;
    id : string;
    userName : string;
    normalizedUserName : string;
    email : string;
    normalizedEmail : string;
    emailConfirmed : boolean;
    passwordHash : string;
    securityStamp : string;
    concurrencyStamp :string;
    phoneNumber : string;
    phoneNumberConfirmed : boolean;
    twoFactorEnabled : boolean;
    lockoutEnabled : boolean;
    accessFailedCount : number;
    online : string;
    NumberDayOff : number ;
}