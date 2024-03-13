export interface Room {
    id: string;
    accountId: string;
    buildingId: string | null;
    roomNumber: string | null;
    roomArea: number;
    numberOfResident: number;
    createUser: string;
    createTime: string;
    modifyUser: string | null;
    modifyTime: string | null;
    status: number;
}

export interface RoomMember {
    id: string;
    roomId: string;
    fullName: string;
    dateOfBirth: string;
    gender: boolean;
    phone: string;
    isHouseholder: boolean;
    createUser: string;
    createTime: string;
    modifyUser: string | null;
    modifyTime: string | null;
    status: number;
}