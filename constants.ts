import { User, Role, Site, Reading } from './types';

// A baseline of 4.5 peak sun hours is used to calculate expected generation.
// This is a common industry average and can be adjusted for more specific regional data.
const PEAK_SUN_HOURS = 4.5;
const AVG_DAYS_IN_MONTH = 30;

export const SITES: Site[] = [
    { id: 1, name: 'Dhiffushi Harbour Area Solar Project', atoll: 'K', island: 'Dhiffushi', capacityKw: 41.16, expectedMonthlyKwh: 41.16 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '87394', commissionedDate: '1/26/2018', gpsCoordinates: '4.441086, 73.714748' },
    { id: 4, name: 'Adh. Omadhoo new PH', atoll: 'ADH', island: 'Omadhoo', capacityKw: 38.94, expectedMonthlyKwh: 38.94 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '19100006525', commissionedDate: '28/Aug/2021', gpsCoordinates: '' },
    { id: 5, name: 'Male\' Powerhouse Bus Station', atoll: 'K', island: 'Male\'', capacityKw: 6.6, expectedMonthlyKwh: 6.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: 'Nil', commissionedDate: '22-Oct-20', gpsCoordinates: '' },
    { id: 6, name: 'Stelco Store Building', atoll: 'K', island: 'Male\'', capacityKw: 39.6, expectedMonthlyKwh: 39.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '19010000001', commissionedDate: '5-Nov-20', gpsCoordinates: '' },
    { id: 7, name: 'Stelco Bottling Plant', atoll: 'K', island: 'Male\'', capacityKw: 47.52, expectedMonthlyKwh: 47.52 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '216609159', commissionedDate: '27-Jan-21', gpsCoordinates: '' },
    { id: 10, name: 'Stelco Vaadhavehi', atoll: 'K', island: 'Male\'', capacityKw: 38.28, expectedMonthlyKwh: 38.28 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670318', commissionedDate: '4-Jun-21', gpsCoordinates: '' },
    { id: 11, name: 'Stelco Gaakoshi', atoll: 'K', island: 'Male\'', capacityKw: 31.68, expectedMonthlyKwh: 31.68 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670318', commissionedDate: '4-Jun-21', gpsCoordinates: '' },
    { id: 12, name: 'Stelco MAN Engine Room (Upper roof)', atoll: 'K', island: 'Male\'', capacityKw: 59.4, expectedMonthlyKwh: 59.4 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670381', commissionedDate: '26-Jun-21', gpsCoordinates: '' },
    { id: 13, name: 'Stelco MAN Engine Room (Lower roof)', atoll: 'K', island: 'Male\'', capacityKw: 47.52, expectedMonthlyKwh: 47.52 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670381', commissionedDate: '3-Aug-21', gpsCoordinates: '' },
    { id: 14, name: 'Hulhumale\' Stelco Store Roof', atoll: 'K', island: 'Hulhumale\'', capacityKw: 127.2, expectedMonthlyKwh: 127.2 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670324', commissionedDate: '25-Oct-21', gpsCoordinates: '' },
    { id: 15, name: 'V. Thinadhoo new PH', atoll: 'V', island: 'Thinadhoo', capacityKw: 29.92, expectedMonthlyKwh: 29.92 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030871', commissionedDate: '12/5/2021', gpsCoordinates: '' },
    { id: 16, name: 'Stelco Gaakosh Red Roof', atoll: 'K', island: 'Male\'', capacityKw: 32, expectedMonthlyKwh: 32 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670318', commissionedDate: '1/4/2022', gpsCoordinates: '' },
    { id: 17, name: 'Stelco Adh. Kunburudhoo PH', atoll: 'ADH', island: 'Kunburudhoo', capacityKw: 21.76, expectedMonthlyKwh: 21.76 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030868', commissionedDate: '17-Jan-22', gpsCoordinates: '' },
    { id: 18, name: 'Stelco Adh. Dhigurah PH', atoll: 'ADH', island: 'Dhigurah', capacityKw: 38.08, expectedMonthlyKwh: 38.08 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030890', commissionedDate: '16-Feb-22', gpsCoordinates: '' },
    { id: 19, name: 'Stelco K. Maafushi PH', atoll: 'K', island: 'Maafushi', capacityKw: 33.48, expectedMonthlyKwh: 33.48 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030891', commissionedDate: '19-Feb-22', gpsCoordinates: '' },
    { id: 20, name: 'Stelco K.Himmafushi PH', atoll: 'K', island: 'Himmafushi', capacityKw: 44.64, expectedMonthlyKwh: 44.64 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030892', commissionedDate: '27-Feb-22', gpsCoordinates: '' },
    { id: 21, name: 'Stelco K.Gaafaru PH', atoll: 'K', island: 'Gaafaru', capacityKw: 71.04, expectedMonthlyKwh: 71.04 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '19100006931', commissionedDate: '14-Mar-22', gpsCoordinates: '' },
    { id: 22, name: 'Stelco V.Fulidhoo PH', atoll: 'V', island: 'Fulidhoo', capacityKw: 16.32, expectedMonthlyKwh: 16.32 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030894', commissionedDate: '10-Mar-22', gpsCoordinates: '' },
    { id: 23, name: 'Stelco Adh.FenFushi PH', atoll: 'ADH', island: 'FenFushi', capacityKw: 27.9, expectedMonthlyKwh: 27.9 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030872', commissionedDate: '18-Mar-22', gpsCoordinates: '' },
    { id: 24, name: 'Stelco Adh.Mandhoo PH', atoll: 'ADH', island: 'Mandhoo', capacityKw: 40.8, expectedMonthlyKwh: 40.8 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030896', commissionedDate: '29-Mar-22', gpsCoordinates: '' },
    { id: 25, name: 'stelco Aa.Bodufulhodhoo PH', atoll: 'AA', island: 'Bodufulhodhoo', capacityKw: 33.6, expectedMonthlyKwh: 33.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '215383494 / 21010030893', commissionedDate: '29-May-22', gpsCoordinates: '' },
    { id: 26, name: 'Stelco MAN Engine Room (South roof)', atoll: 'K', island: 'Male\'', capacityKw: 54.87, expectedMonthlyKwh: 54.87 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670381', commissionedDate: '11-Aug-22', gpsCoordinates: '' },
    { id: 27, name: 'stelco Aa.Feridhoo PH', atoll: 'AA', island: 'Feridhoo', capacityKw: 48, expectedMonthlyKwh: 48 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030895', commissionedDate: '5-Jun-22', gpsCoordinates: '' },
    { id: 28, name: 'Stelco Adh.Hangnameedhoo PH', atoll: 'ADH', island: 'Hangnameedhoo', capacityKw: 25.84, expectedMonthlyKwh: 25.84 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030866', commissionedDate: '23-Jun-22', gpsCoordinates: '' },
    { id: 29, name: 'Thoddoo RO plant', atoll: 'AA', island: 'Thoddoo', capacityKw: 26.04, expectedMonthlyKwh: 26.04 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030870', commissionedDate: '23-Aug-22', gpsCoordinates: '' },
    { id: 30, name: 'stelco MED plant', atoll: 'K', island: 'Male\'', capacityKw: 59.52, expectedMonthlyKwh: 59.52 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030865', commissionedDate: '15-Sep-22', gpsCoordinates: '' },
    { id: 31, name: 'stelco AA.Mathiveri PH', atoll: 'AA', island: 'Mathiveri', capacityKw: 35.2, expectedMonthlyKwh: 35.2 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030952', commissionedDate: '25-Sep-22', gpsCoordinates: '' },
    { id: 32, name: 'Omadhoo Sewerage Pant', atoll: 'ADH', island: 'Omadhoo', capacityKw: 18.6, expectedMonthlyKwh: 18.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030951', commissionedDate: '16-Nov-22', gpsCoordinates: '' },
    { id: 33, name: 'Hulhumale\' Old PH Garage Roof', atoll: 'K', island: 'Hulhumale\'', capacityKw: 27.9, expectedMonthlyKwh: 27.9 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030915', commissionedDate: '27-Nov-22', gpsCoordinates: '' },
    { id: 34, name: 'Hulhumale\' Old PH West Roof (STEWO)', atoll: 'K', island: 'Hulhumale\'', capacityKw: 66.96, expectedMonthlyKwh: 66.96 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '250712503', commissionedDate: '28-Nov-22', gpsCoordinates: '' },
    { id: 35, name: 'Hulhumale\' Old PH Workshop Roof', atoll: 'K', island: 'Hulhumale\'', capacityKw: 16.74, expectedMonthlyKwh: 16.74 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030288', commissionedDate: '1-Dec-22', gpsCoordinates: '' },
    { id: 36, name: 'Hulhumale\' Service Center Roof', atoll: 'K', island: 'Hulhumale\'', capacityKw: 33.28, expectedMonthlyKwh: 33.28 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21011030647', commissionedDate: '5-Feb-23', gpsCoordinates: '' },
    { id: 37, name: 'Stelco K.Gulhi Sewerage Plant Roof', atoll: 'K', island: 'Gulhi', capacityKw: 19.2, expectedMonthlyKwh: 19.2 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '214670361', commissionedDate: '9-Jan-23', gpsCoordinates: '' },
    { id: 38, name: 'Hulhumale\' Old PH Mechanical Workshop Roof', atoll: 'K', island: 'Hulhumale\'', capacityKw: 22.785, expectedMonthlyKwh: 22.785 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030914', commissionedDate: '9-Jan-23', gpsCoordinates: '' },
    { id: 39, name: 'Stelco K.GulhiPH', atoll: 'K', island: 'Gulhi', capacityKw: 22.32, expectedMonthlyKwh: 22.32 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030645', commissionedDate: '17-Feb-23', gpsCoordinates: '' },
    { id: 40, name: 'Stelco AA.Maalhos PH', atoll: 'AA', island: 'Maalhos', capacityKw: 42.16, expectedMonthlyKwh: 42.16 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030765', commissionedDate: '25-Feb-23', gpsCoordinates: '' },
    { id: 41, name: 'V.Fulidhoo PH Extension', atoll: 'V', island: 'Fulidhoo', capacityKw: 5.44, expectedMonthlyKwh: 5.44 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030894', commissionedDate: '15-Mar-23', gpsCoordinates: '' },
    { id: 43, name: 'STELCO 104', atoll: 'K', island: 'Male\'', capacityKw: 16.74, expectedMonthlyKwh: 16.74 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030768', commissionedDate: '3-Apr-23', gpsCoordinates: '' },
    { id: 44, name: 'Wartsila PH', atoll: 'K', island: 'Male\'', capacityKw: 81.84, expectedMonthlyKwh: 81.84 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: 'HMT0133220000114', commissionedDate: '16-May-23', gpsCoordinates: '' },
    { id: 45, name: 'Adh. Omadhoo new PH Control room', atoll: 'ADH', island: 'Omadhoo', capacityKw: 9.3, expectedMonthlyKwh: 9.3 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '19100006525', commissionedDate: '27-May-23', gpsCoordinates: '' },
    { id: 46, name: 'Stelco k.thilafushi PH', atoll: 'K', island: 'Thilafushi', capacityKw: 102.99, expectedMonthlyKwh: 102.99 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: 'HMT0133220000118', commissionedDate: '27-May-23', gpsCoordinates: '' },
    { id: 47, name: 'Stelco Aa.Ukulhas PH', atoll: 'AA', island: 'Ukulhas', capacityKw: 42.78, expectedMonthlyKwh: 42.78 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '21010030766', commissionedDate: '15-Oct-23', gpsCoordinates: '' },
    { id: 48, name: 'STELCO Power Generation Accommodation Block (White House)', atoll: 'K', island: 'Male\'', capacityKw: 9.3, expectedMonthlyKwh: 9.3 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200107611', commissionedDate: '2-Nov-23', gpsCoordinates: '' },
    { id: 49, name: 'STELCO HFO', atoll: 'K', island: 'Male\'', capacityKw: 36.8, expectedMonthlyKwh: 36.8 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200107990', commissionedDate: '23-Jan-24', gpsCoordinates: '' },
    { id: 50, name: 'STELCO Wartsila PH Lower Roof', atoll: 'K', island: 'Male\'', capacityKw: 37.2, expectedMonthlyKwh: 37.2 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200106984', commissionedDate: '30-Jan-24', gpsCoordinates: '' },
    { id: 51, name: 'STELCO Wartsila PH Control Room Roof', atoll: 'K', island: 'Male\'', capacityKw: 10.56, expectedMonthlyKwh: 10.56 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200108667', commissionedDate: '1-Feb-24', gpsCoordinates: '' },
    { id: 52, name: 'STELCO TND Workshop Roof', atoll: 'K', island: 'Male\'', capacityKw: 47.5, expectedMonthlyKwh: 47.5 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200108666', commissionedDate: '18-Feb-24', gpsCoordinates: '' },
    { id: 53, name: 'STELCO Felidhoo PH', atoll: 'V', island: 'Felidhoo', capacityKw: 40.14, expectedMonthlyKwh: 40.14 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200109531', commissionedDate: '20-May-24', gpsCoordinates: '' },
    { id: 54, name: 'STELCO 50MW PH Workshop', atoll: 'K', island: 'Hulhumale\'', capacityKw: 19, expectedMonthlyKwh: 19 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: 'HMT0133220000113', commissionedDate: '2-Jun-24', gpsCoordinates: '' },
    { id: 55, name: 'STELCO 50MW PH Comprehensive Pump and MED Control', atoll: 'K', island: 'Hulhumale\'', capacityKw: 28.32, expectedMonthlyKwh: 28.32 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: 'HMT0133220000113', commissionedDate: '2-Jun-24', gpsCoordinates: '' },
    { id: 56, name: 'STELCO Aa.Thoddoo Power House', atoll: 'AA', island: 'Thoddoo', capacityKw: 64.6, expectedMonthlyKwh: 64.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200110385', commissionedDate: '12-Jun-24', gpsCoordinates: '' },
    { id: 57, name: 'STELCO Adh.Mahibadhoo Power House', atoll: 'ADH', island: 'Mahibadhoo', capacityKw: 64.6, expectedMonthlyKwh: 64.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200111485', commissionedDate: '10-Jul-24', gpsCoordinates: '' },
    { id: 58, name: 'STELCO Aa.Rasdhoo Power House', atoll: 'AA', island: 'Rasdhoo', capacityKw: 72.675, expectedMonthlyKwh: 72.675 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: 'HMT0133230000331', commissionedDate: '11-Jul-24', gpsCoordinates: '' },
    { id: 59, name: 'STELCO Aa.Himandhoo Power House', atoll: 'AA', island: 'Himandhoo', capacityKw: 48.45, expectedMonthlyKwh: 48.45 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200111483', commissionedDate: '29-Jul-24', gpsCoordinates: '' },
    { id: 60, name: 'Adh.Dhangethi Power House', atoll: 'ADH', island: 'Dhangethi', capacityKw: 36.57, expectedMonthlyKwh: 36.57 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200109411', commissionedDate: '1-Aug-24', gpsCoordinates: '' },
    { id: 61, name: 'STELCO V.Rakeedhoo PH office', atoll: 'V', island: 'Rakeedhoo', capacityKw: 18.3, expectedMonthlyKwh: 18.3 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200107807', commissionedDate: '16-Oct-24', gpsCoordinates: '' },
    { id: 62, name: 'STELCO V.Rakeedhoo PH Control roof', atoll: 'V', island: 'Rakeedhoo', capacityKw: 16.6, expectedMonthlyKwh: 16.6 * PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH, meterNumber: '503200107807', commissionedDate: '16-Oct-24', gpsCoordinates: '' },
];

export const USERS: User[] = [
    { id: 1, name: 'Administrator', role: Role.ADMIN, accessibleSites: SITES.map(s => s.id) },
    { id: 2, name: 'Operator', role: Role.USER, accessibleSites: SITES.map(s => s.id) },
];

const today = new Date();
const MONTHS_IN_YEAR = 12;

// Function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const generateReadingsForSite = (site: Site, performanceCategory: 'good' | 'mid' | 'low'): Reading[] => {
    const readings: Reading[] = [];
    for (let i = 0; i < MONTHS_IN_YEAR; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const dateStr = `${year}-${month}`;

        let performanceFactor: number;

        // For the most recent month (i=0), apply the specified performance category
        if (i === 0) {
            switch (performanceCategory) {
                case 'good':
                    performanceFactor = 0.7 + Math.random() * 0.4; // 70% - 110%
                    break;
                case 'mid':
                    performanceFactor = 0.51 + Math.random() * 0.18; // 51% - 69%
                    break;
                case 'low':
                    performanceFactor = 0.3 + Math.random() * 0.2; // 30% - 50%
                    break;
            }
        } else {
            // For historical months, use general randomness
             performanceFactor = 0.6 + Math.random() * 0.5; // 60% - 110%
        }
        
        const value = Math.round(site.expectedMonthlyKwh * performanceFactor);

        readings.push({
            id: site.id * 1000 + (MONTHS_IN_YEAR - i),
            siteId: site.id,
            date: dateStr,
            valueKwh: value,
        });
    }
    return readings.reverse(); // Reverse to have oldest first
};


const generateAllReadings = (): Reading[] => {
    const shuffledSites = shuffleArray(SITES);
    const totalSites = SITES.length;
    
    const goodCount = Math.ceil(totalSites * 0.7);
    const midCount = Math.floor(totalSites * 0.2);
    // const lowCount = totalSites - goodCount - midCount;

    const goodSites = shuffledSites.slice(0, goodCount);
    const midSites = shuffledSites.slice(goodCount, goodCount + midCount);
    const lowSites = shuffledSites.slice(goodCount + midCount);

    let allReadings: Reading[] = [];

    goodSites.forEach(site => {
        allReadings = [...allReadings, ...generateReadingsForSite(site, 'good')];
    });
    midSites.forEach(site => {
        allReadings = [...allReadings, ...generateReadingsForSite(site, 'mid')];
    });
    lowSites.forEach(site => {
        allReadings = [...allReadings, ...generateReadingsForSite(site, 'low')];
    });

    return allReadings;
}

export const INITIAL_READINGS: Reading[] = generateAllReadings();