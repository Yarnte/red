export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface User {
    id: number;
    name: string;
    role: Role;
    accessibleSites: number[]; // Array of site IDs
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
    id: number;
    siteId: number;
    date: string; // Format: YYYY-MM
    valueKwh: number;
}