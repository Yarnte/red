
import { db } from '../firebaseConfig';
import * as firestore from 'firebase/firestore';
import { User, Site, Reading } from '../types';

const {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    onSnapshot,
    query,
    writeBatch
} = firestore as any;

// --- User Profile Functions ---
export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
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
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};


// --- Site Functions ---
export const getAllSites = async (): Promise<Site[]> => {
    try {
        const sitesCollectionRef = collection(db, 'sites');
        const sitesSnapshot = await getDocs(sitesCollectionRef);
        const sitesList = sitesSnapshot.docs.map((doc: any) => ({ ...doc.data(), id: parseInt(doc.id, 10) } as Site));
        return sitesList.sort((a: Site, b: Site) => a.id - b.id);
    } catch (error) {
        console.error("Error fetching sites:", error);
        return [];
    }
};

export const onSitesUpdate = (callback: (sites: Site[]) => void) => {
    const sitesCollectionRef = collection(db, 'sites');
    return onSnapshot(query(sitesCollectionRef), (snapshot: any) => {
        const sitesList = snapshot.docs.map((doc: any) => ({ ...doc.data(), id: parseInt(doc.id, 10) } as Site));
        callback(sitesList.sort((a: Site, b: Site) => a.id - b.id));
    }, (error: any) => {
        console.error("Error on sites update:", error);
        alert(`Real-time connection error for sites: ${error.message}`);
    });
};

export const addSite = async (siteData: Omit<Site, 'id' | 'expectedMonthlyKwh'>) => {
    try {
        const sites = await getAllSites();
        const newSiteId = sites.length > 0 ? Math.max(...sites.map(s => s.id)) + 1 : 1;
        
        const newSite: Omit<Site, 'id'> = {
            ...siteData,
            expectedMonthlyKwh: siteData.capacityKw * 4.5 * 30,
        };
        
        const siteDocRef = doc(db, 'sites', newSiteId.toString());
        await setDoc(siteDocRef, newSite);
    } catch (error) {
        console.error("Error adding site:", error);
        alert("Failed to add site to database.");
    }
};

export const updateSite = async (site: Site) => {
    try {
        const siteDocRef = doc(db, 'sites', site.id.toString());
        // Firebase requires plain objects, so we remove the id before updating
        const { id, ...siteData } = site;
        await updateDoc(siteDocRef, siteData);
    } catch (error) {
        console.error("Error updating site:", error);
        alert("Failed to update site in database.");
    }
};


// --- Reading Functions ---
export const onReadingsUpdate = (callback: (readings: Reading[]) => void, onInitialLoad: () => void) => {
    const readingsCollectionRef = collection(db, 'readings');
    let isInitialLoad = true;
    return onSnapshot(query(readingsCollectionRef), (snapshot: any) => {
        const readingsList = snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as Reading));
        callback(readingsList);
        if (isInitialLoad) {
            onInitialLoad();
            isInitialLoad = false;
        }
    }, (error: any) => {
        console.error("Error on readings update:", error);
        alert(`Real-time connection error for readings: ${error.message}`);
    });
};

export const addReading = async (readingData: Omit<Reading, 'id'>) => {
    try {
        const readingsCollectionRef = collection(db, 'readings');
        await addDoc(readingsCollectionRef, readingData);
    } catch (error) {
        console.error("Error adding reading:", error);
        alert("Failed to save reading to database.");
    }
};

export const updateReading = async (reading: Reading) => {
    try {
        const readingDocRef = doc(db, 'readings', reading.id);
        const { id, ...readingData } = reading;
        await updateDoc(readingDocRef, readingData);
    } catch (error) {
        console.error("Error updating reading:", error);
        alert("Failed to update reading in database.");
    }
};

// --- Seeding Function ---
export const seedDatabase = async (sites: Site[], readings: Reading[]) => {
    if (!window.confirm("This will overwrite existing sites and readings with default data. Are you sure?")) {
        return;
    }
    
    try {
        const batchSize = 400; // Firestore limit is 500, keep it safe
        let batch = writeBatch(db);
        let operationCount = 0;

        // Seed Sites
        for (const site of sites) {
            const siteRef = doc(db, 'sites', site.id.toString());
            const { id, ...siteData } = site; 
            batch.set(siteRef, siteData);
            operationCount++;

            if (operationCount >= batchSize) {
                await batch.commit();
                batch = writeBatch(db);
                operationCount = 0;
            }
        }

        // Seed Readings
        for (const reading of readings) {
            const readingRef = doc(db, 'readings', reading.id);
            const { id, ...readingData } = reading;
            batch.set(readingRef, readingData);
            operationCount++;

            if (operationCount >= batchSize) {
                await batch.commit();
                batch = writeBatch(db);
                operationCount = 0;
            }
        }

        if (operationCount > 0) {
            await batch.commit();
        }
        
        alert("Database seeded successfully! The charts should now appear.");
    } catch (error: any) {
        console.error("Error seeding database:", error);
        alert(`Failed to seed database: ${error.message}`);
    }
};
