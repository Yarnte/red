import { db } from '../firebaseConfig';
import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    onSnapshot,
    query
} from 'firebase/firestore';
import { User, Site, Reading, Role } from '../types';

// --- User Profile Functions ---
export const getUserProfile = async (uid: string): Promise<User | null> => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return {
            id: userDocSnap.id,
            name: data.name,
            role: data.role,
            accessibleSites: data.accessibleSites,
        };
    }
    console.error("No such user profile document!");
    return null;
};


// --- Site Functions ---
export const getAllSites = async (): Promise<Site[]> => {
    const sitesCollectionRef = collection(db, 'sites');
    const sitesSnapshot = await getDocs(sitesCollectionRef);
    const sitesList = sitesSnapshot.docs.map(doc => ({ ...doc.data(), id: parseInt(doc.id, 10) } as Site));
    return sitesList.sort((a,b) => a.id - b.id);
};

export const onSitesUpdate = (callback: (sites: Site[]) => void) => {
    const sitesCollectionRef = collection(db, 'sites');
    return onSnapshot(query(sitesCollectionRef), (snapshot) => {
        const sitesList = snapshot.docs.map(doc => ({ ...doc.data(), id: parseInt(doc.id, 10) } as Site));
        callback(sitesList.sort((a,b) => a.id - b.id));
    });
};

export const addSite = async (siteData: Omit<Site, 'id' | 'expectedMonthlyKwh'>) => {
    const sites = await getAllSites();
    const newSiteId = sites.length > 0 ? Math.max(...sites.map(s => s.id)) + 1 : 1;
    
    const newSite: Omit<Site, 'id'> = {
        ...siteData,
        expectedMonthlyKwh: siteData.capacityKw * 4.5 * 30,
    };
    
    const siteDocRef = doc(db, 'sites', newSiteId.toString());
    await setDoc(siteDocRef, newSite);
};

export const updateSite = async (site: Site) => {
    const siteDocRef = doc(db, 'sites', site.id.toString());
    const { id, ...siteData } = site;
    await updateDoc(siteDocRef, siteData);
};


// --- Reading Functions ---
export const onReadingsUpdate = (callback: (readings: Reading[]) => void, onInitialLoad: () => void) => {
    const readingsCollectionRef = collection(db, 'readings');
    let isInitialLoad = true;
    return onSnapshot(query(readingsCollectionRef), (snapshot) => {
        const readingsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Reading));
        callback(readingsList);
        if (isInitialLoad) {
            onInitialLoad();
            isInitialLoad = false;
        }
    });
};

export const addReading = async (readingData: Omit<Reading, 'id'>) => {
    const readingsCollectionRef = collection(db, 'readings');
    await addDoc(readingsCollectionRef, readingData);
};

export const updateReading = async (reading: Reading) => {
    const readingDocRef = doc(db, 'readings', reading.id);
    const { id, ...readingData } = reading;
    await updateDoc(readingDocRef, readingData);
};