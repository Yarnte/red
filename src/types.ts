export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface User {
    id: string; // Firebase UID
    name: string;
    role: Role;
    accessibleSites: number[];
}

export interface Site {
    id: number;
    name: string;
    atoll: string;
    island: string;
    capacityKw: number;
    expectedMonthlyKwh: number;
    meterNumber: string;
    commissionedDate: string;
    gpsCoordinates?: string;
}

export interface Reading {
    id: string; // Firestore document ID
    siteId: number;
    date: string; // Format: YYYY-MM
    valueKwh: number;
}