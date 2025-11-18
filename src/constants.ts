import { Site } from './types';

const PEAK_SUN_HOURS = 4.5;
const AVG_DAYS_IN_MONTH = 30;

export const SITES: Site[] = [
    { id: 1, name: 'Dhiffushi Harbour area Solar Project', atoll: 'K', island: 'Dhiffushi', capacityKw: 41.16, expectedMonthlyKwh: 41.16 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '87394', commissionedDate: '1/26/2018', gpsCoordinates: '4.441086, 73.714748' },
    { id: 4, name: 'Adh. Omadhoo new PH', atoll: 'ADH', island: 'Omadhoo', capacityKw: 38.94, expectedMonthlyKwh: 38.94 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '19100006525', commissionedDate: '28/Aug/2021', gpsCoordinates: '' },
    // ... (Ensure all your sites are listed here. I'm including the first few for brevity, but please keep the full list you had)
    { id: 5, name: 'Male\' Powerhouse Bus Station', atoll: 'K', island: 'Male\'', capacityKw: 6.6, expectedMonthlyKwh: 6.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: 'Nil', commissionedDate: '22-Oct-20', gpsCoordinates: '' },
    { id: 6, name: 'Stelco Store Building', atoll: 'K', island: 'Male\'', capacityKw: 39.6, expectedMonthlyKwh: 39.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '19010000001', commissionedDate: '5-Nov-20', gpsCoordinates: '' },
    // ... add the rest of your 57 sites ...
    { id: 62, name: 'STELCO V.Rakeedhoo PH Control roof', atoll: 'V', island: 'Rakeedhoo', capacityKw: 16.6, expectedMonthlyKwh: 16.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200107807', commissionedDate: '16-Oct-24', gpsCoordinates: '' },
];

// We also export this as SITES_DATA_FOR_FIRESTORE for clarity if needed elsewhere, but SITES is the key export.
export const SITES_DATA_FOR_FIRESTORE = SITES;
