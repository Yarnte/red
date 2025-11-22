import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { AuthContext } from '../App';
import { SITES, INITIAL_READINGS } from '../constants';
import { Site, Reading, Role } from '../types';
import Header from './Header';
import SiteCard from './SiteCard';
import SiteDetail from './SiteDetail';
import Reports from './Reports';
import AggregateStats from './AggregateStats';
import BreakdownView from './BreakdownView';
import { ChevronDownIcon } from './Icons';
import MeterReadingModal from './MeterReadingModal';
import EditReadingModal from './EditReadingModal';
import AddSiteModal from './AddSiteModal';
import EditSiteModal from './EditSiteModal';
import SelectSiteModal from './SelectSiteModal';

type View = 'dashboard' | 'reports';

const Dashboard: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [sites, setSites] = useState<Site[]>([]);
    const [readings, setReadings] = useState<Reading[]>([]);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [view, setView] = useState<View>('dashboard');
    
    // Modal states
    const [isAddReadingModalOpen, setIsAddReadingModalOpen] = useState(false);
    const [isEditReadingModalOpen, setIsEditReadingModalOpen] = useState(false);
    const [editingReading, setEditingReading] = useState<Reading | null>(null);
    const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
    const [isSelectSiteModalOpen, setIsSelectSiteModalOpen] = useState(false);
    const [isEditSiteModalOpen, setIsEditSiteModalOpen] = useState(false);
    const [editingSite, setEditingSite] = useState<Site | null>(null);

    // Actions dropdown state
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
    const actionsMenuRef = useRef<HTMLDivElement>(null);


    // Data initialization from localStorage
    useEffect(() => {
        const storedSites = localStorage.getItem('solarSites');
        if (storedSites) {
            setSites(JSON.parse(storedSites));
        } else {
            setSites(SITES);
            localStorage.setItem('solarSites', JSON.stringify(SITES));
        }

        const storedReadings = localStorage.getItem('solarReadings');
        if (storedReadings) {
            setReadings(JSON.parse(storedReadings));
        } else {
            setReadings(INITIAL_READINGS);
            localStorage.setItem('solarReadings', JSON.stringify(INITIAL_READINGS));
        }
    }, []);

    // Close actions menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
                setIsActionsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userSites = useMemo(() => {
        if (!authContext?.user || !authContext?.island) return [];
        const accessibleSites = sites.filter(site => authContext.user.accessibleSites.includes(site.id));
        
        if (authContext.island === 'all') {
             return accessibleSites;
        }
        
        return accessibleSites.filter(site => `${site.atoll}. ${site.island}` === authContext.island);
    }, [authContext?.user, authContext?.island, sites]);
    
    const allUserAccessibleSites = useMemo(() => {
        if (!authContext?.user) return [];
        // This is not filtered by island, which is what's needed for the Atoll summary
        return sites.filter(site => authContext.user.accessibleSites.includes(site.id));
    }, [authContext?.user, sites]);


    // Reading handlers
    const handleAddReading = (newReading: Omit<Reading, 'id'>) => {
        setReadings(prevReadings => {
            const updatedReadings = [...prevReadings, { ...newReading, id: Date.now() }];
            localStorage.setItem('solarReadings', JSON.stringify(updatedReadings));
            return updatedReadings;
        });
        setIsAddReadingModalOpen(false);
    };

    const handleOpenEditReadingModal = (reading: Reading) => {
        setEditingReading(reading);
        setIsEditReadingModalOpen(true);
    };

    const handleUpdateReading = (updatedReading: Reading) => {
        setReadings(prevReadings => {
            const updatedReadings = prevReadings.map(r => r.id === updatedReading.id ? updatedReading : r);
            localStorage.setItem('solarReadings', JSON.stringify(updatedReadings));
            return updatedReadings;
        });
        setIsEditReadingModalOpen(false);
        setEditingReading(null);
    };
    
    // Site handlers
    const handleAddSite = (newSiteData: Omit<Site, 'id' | 'expectedMonthlyKwh'>) => {
        setSites(prevSites => {
            const newSite: Site = {
                ...newSiteData,
                id: prevSites.length > 0 ? Math.max(...prevSites.map(s => s.id)) + 1 : 1,
                expectedMonthlyKwh: newSiteData.capacityKw * 4.5 * 30, // PEAK_SUN_HOURS * AVG_DAYS_IN_MONTH
            };
            const updatedSites = [...prevSites, newSite];
            localStorage.setItem('solarSites', JSON.stringify(updatedSites));
            return updatedSites;
        });
        setIsAddSiteModalOpen(false);
    };

    const handleSelectSiteToEdit = (site: Site) => {
        setEditingSite(site);
        setIsSelectSiteModalOpen(false);
        setIsEditSiteModalOpen(true);
    };

    const handleUpdateSite = (updatedSite: Site) => {
        setSites(prevSites => {
            const updatedSites = prevSites.map(s => s.id === updatedSite.id ? updatedSite : s);
            localStorage.setItem('solarSites', JSON.stringify(updatedSites));
            return updatedSites;
        });
        setIsEditSiteModalOpen(false);
        setEditingSite(null);
        if(selectedSite?.id === updatedSite.id) {
            setSelectedSite(updatedSite);
        }
    };
    
    const renderContent = () => {
        if (!authContext?.user) return null;
        
        switch(view) {
            case 'dashboard':
                return (
                    <div className="space-y-8">
                        <AggregateStats sites={userSites} readings={readings} />
                        <BreakdownView 
                            sites={allUserAccessibleSites} 
                            readings={readings}
                            userRole={authContext.user.role}
                            selectedLocation={authContext.island}
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-brand-blue mt-8">All Individual Sites</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {userSites.map(site => {
                                    const siteReadings = readings.filter(r => r.siteId === site.id);
                                    const latestReading = siteReadings.sort((a, b) => b.date.localeCompare(a.date))[0];
                                    return (
                                        <SiteCard
                                            key={site.id}
                                            site={site}
                                            latestReading={latestReading}
                                            onClick={() => setSelectedSite(site)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            case 'reports':
                return <Reports sites={userSites} readings={readings} />;
            default:
                return null;
        }
    };

    if (selectedSite) {
        return (
            <div className="min-h-screen bg-brand-gray">
                <Header />
                <SiteDetail 
                    site={selectedSite} 
                    readings={readings.filter(r => r.siteId === selectedSite.id)} 
                    onBack={() => setSelectedSite(null)}
                    onEditReading={handleOpenEditReadingModal}
                />
                 {isEditReadingModalOpen && editingReading && <EditReadingModal reading={editingReading} onClose={() => { setIsEditReadingModalOpen(false); setEditingReading(null); }} onSave={handleUpdateReading} />}
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-brand-gray">
            <Header />

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                   <div>
                        <h2 className="text-3xl font-bold text-brand-blue">Dashboard</h2>
                        <p className="text-gray-600 mt-1">Overview of solar assets</p>
                   </div>
                   <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <button 
                            onClick={() => setView('dashboard')}
                            className={`px-4 py-2 rounded-md font-semibold transition ${view === 'dashboard' ? 'bg-brand-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                            Dashboard
                        </button>
                        <button 
                             onClick={() => setView('reports')}
                             className={`px-4 py-2 rounded-md font-semibold transition ${view === 'reports' ? 'bg-brand-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                            Reports
                        </button>
                        <div className="relative" ref={actionsMenuRef}>
                            <button
                                onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                                className="flex items-center space-x-2 px-4 py-2 bg-brand-yellow text-brand-blue font-bold rounded-md hover:opacity-90 transition shadow"
                            >
                                <span>Actions</span>
                                <ChevronDownIcon className="h-5 w-5" />
                            </button>
                            {isActionsMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                                    <button onClick={() => { setIsAddReadingModalOpen(true); setIsActionsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add New Reading</button>
                                    {authContext?.user?.role === Role.ADMIN && (
                                        <>
                                             <button onClick={() => { setIsAddSiteModalOpen(true); setIsActionsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add New Site</button>
                                             <button onClick={() => { setIsSelectSiteModalOpen(true); setIsActionsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit Site</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                   </div>
                </div>

                {renderContent()}
            </main>
            
            {isAddReadingModalOpen && <MeterReadingModal sites={userSites} readings={readings} onClose={() => setIsAddReadingModalOpen(false)} onSave={handleAddReading} />}
            {isEditReadingModalOpen && editingReading && <EditReadingModal reading={editingReading} onClose={() => { setIsEditReadingModalOpen(false); setEditingReading(null); }} onSave={handleUpdateReading} />}
            {isAddSiteModalOpen && <AddSiteModal onClose={() => setIsAddSiteModalOpen(false)} onSave={handleAddSite} />}
            {isSelectSiteModalOpen && <SelectSiteModal sites={sites} onClose={() => setIsSelectSiteModalOpen(false)} onSelect={handleSelectSiteToEdit} />}
            {isEditSiteModalOpen && editingSite && <EditSiteModal site={editingSite} onClose={() => { setIsEditSiteModalOpen(false); setEditingSite(null); }} onSave={handleUpdateSite} />}
        </div>
    );
};

export default Dashboard;