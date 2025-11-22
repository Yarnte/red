
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { AuthContext } from '../App';
import * as dataService from '../services/dataService';
import { Site, Reading, Role } from '../types';
import { SITES, INITIAL_READINGS } from '../constants';
import Header from './Header';
import SiteCard from './SiteCard';
import SiteDetail from './SiteDetail';
import Reports from './Reports';
import AggregateStats from './AggregateStats';
import BreakdownView from './BreakdownView';
import PerformancePieChart from './PerformancePieChart';
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
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [view, setView] = useState<View>('dashboard');
    
    const [isAddReadingModalOpen, setIsAddReadingModalOpen] = useState(false);
    const [isEditReadingModalOpen, setIsEditReadingModalOpen] = useState(false);
    const [editingReading, setEditingReading] = useState<Reading | null>(null);
    const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
    const [isSelectSiteModalOpen, setIsSelectSiteModalOpen] = useState(false);
    const [isEditSiteModalOpen, setIsEditSiteModalOpen] = useState(false);
    const [editingSite, setEditingSite] = useState<Site | null>(null);
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
    const actionsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribeSites = dataService.onSitesUpdate(setSites);
        const unsubscribeReadings = dataService.onReadingsUpdate(setReadings, () => setIsLoading(false));

        return () => {
            unsubscribeSites();
            unsubscribeReadings();
        };
    }, []);

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
        
        const accessibleSiteIds = authContext.user.accessibleSites || [];
        const accessibleSites = sites.filter(site => accessibleSiteIds.includes(site.id));
        
        if (authContext.island === 'all') return accessibleSites;
        return accessibleSites.filter(site => `${site.atoll}. ${site.island}` === authContext.island);
    }, [authContext?.user, authContext?.island, sites]);
    
    const allUserAccessibleSites = useMemo(() => {
        if (!authContext?.user) return [];
        const accessibleSiteIds = authContext.user.accessibleSites || [];
        return sites.filter(site => accessibleSiteIds.includes(site.id));
    }, [authContext?.user, sites]);

    const handleAddReading = async (newReading: Omit<Reading, 'id'>) => {
        await dataService.addReading(newReading);
        setIsAddReadingModalOpen(false);
    };

    const handleOpenEditReadingModal = (reading: Reading) => {
        setEditingReading(reading);
        setIsEditReadingModalOpen(true);
    };

    const handleUpdateReading = async (updatedReading: Reading) => {
        await dataService.updateReading(updatedReading);
        setIsEditReadingModalOpen(false);
        setEditingReading(null);
    };
    
    const handleAddSite = async (newSiteData: Omit<Site, 'id' | 'expectedMonthlyKwh'>) => {
        await dataService.addSite(newSiteData);
        setIsAddSiteModalOpen(false);
    };

    const handleSelectSiteToEdit = (site: Site) => {
        setEditingSite(site);
        setIsSelectSiteModalOpen(false);
        setIsEditSiteModalOpen(true);
    };

    const handleUpdateSite = async (updatedSite: Site) => {
        await dataService.updateSite(updatedSite);
        setIsEditSiteModalOpen(false);
        setEditingSite(null);
        if(selectedSite?.id === updatedSite.id) setSelectedSite(updatedSite);
    };

    const handleSeedDatabase = async () => {
        await dataService.seedDatabase(SITES, INITIAL_READINGS);
        setIsActionsMenuOpen(false);
    };
    
    const renderContent = () => {
        if (!authContext?.user) return null;
        if (isLoading) return <div className="text-center p-12">Loading live data from server...</div>;
        
        if (view === 'reports') return <Reports sites={userSites} readings={readings} />;

        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                         <AggregateStats sites={userSites} readings={readings} />
                    </div>
                    <div className="lg:col-span-1">
                         <PerformancePieChart sites={userSites} readings={readings} />
                    </div>
                </div>

                <BreakdownView 
                    sites={allUserAccessibleSites} 
                    readings={readings}
                    userRole={authContext.user.role}
                    selectedLocation={authContext.island}
                />
                <div>
                    <h3 className="text-2xl font-bold text-brand-blue mt-8">Individual Sites</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {userSites.map(site => {
                            const siteReadings = readings.filter(r => r.siteId === site.id);
                            const latestReading = siteReadings.sort((a, b) => b.date.localeCompare(a.date))[0];
                            return <SiteCard key={site.id} site={site} latestReading={latestReading} onClick={() => setSelectedSite(site)} />;
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const FullScreenModal = () => (
        <>
            {isAddReadingModalOpen && <MeterReadingModal sites={userSites} readings={readings} onClose={() => setIsAddReadingModalOpen(false)} onSave={handleAddReading} />}
            {isEditReadingModalOpen && editingReading && <EditReadingModal reading={editingReading} onClose={() => { setIsEditReadingModalOpen(false); setEditingReading(null); }} onSave={handleUpdateReading} />}
            {isAddSiteModalOpen && <AddSiteModal onClose={() => setIsAddSiteModalOpen(false)} onSave={handleAddSite} />}
            {isSelectSiteModalOpen && <SelectSiteModal sites={sites} onClose={() => setIsSelectSiteModalOpen(false)} onSelect={handleSelectSiteToEdit} />}
            {isEditSiteModalOpen && editingSite && <EditSiteModal site={editingSite} onClose={() => { setIsEditSiteModalOpen(false); setEditingSite(null); }} onSave={handleUpdateSite} />}
        </>
    );

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
                <FullScreenModal />
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
                        <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-md font-semibold transition ${view === 'dashboard' ? 'bg-brand-blue text-white' : 'bg-white text-gray-700'}`}>Dashboard</button>
                        <button onClick={() => setView('reports')} className={`px-4 py-2 rounded-md font-semibold transition ${view === 'reports' ? 'bg-brand-blue text-white' : 'bg-white text-gray-700'}`}>Reports</button>
                        <div className="relative" ref={actionsMenuRef}>
                            <button onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)} className="flex items-center space-x-2 px-4 py-2 bg-brand-yellow text-brand-blue font-bold rounded-md shadow">
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
                                             <button onClick={handleSeedDatabase} className="w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 border-t">Seed Database (Demo)</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                   </div>
                </div>
                {renderContent()}
            </main>
            <FullScreenModal />
        </div>
    );
};

export default Dashboard;
