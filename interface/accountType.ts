export interface user{
    FullName:string;
    PhoneNumber:string;
    Id:string;
    Avatar:string;
    BuildingId: string;
}

export interface AccountOwner{
    fullName:string;
    phoneNumber: string;
}

export interface Account {
    id: string;
    buildingId?: string | null; // Optional field to allow null values
    phoneNumber: string;
    passwordSalt: string;
    passwordHash: string;
    userName: string;
    email: string;
    fullName: string;
    role: number;
    avatar: string | null; // Optional field to allow null values
    createUser: string;
    createTime: string; // Date string should be consistent with backend format
    modifyUser: string | null; // Optional field to allow null values
    modifyTime: string | null; // Optional field to allow null values
    status: number;
}