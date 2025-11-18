import React, { useState, useMemo } from 'react';
import { Site, Reading, Role } from '../types';
import { ChevronDownIcon, ZapIcon, SunIcon, AlertTriangleIcon, WindIcon, LeafIcon, ServerIcon } from './Icons';

interface BreakdownViewProps {
    sites: Site[];
    readings: Reading[];
    userRole: Role;
    selectedLocation: string | null;
}

interface StatData {
    totalCapacity: number;
    totalExpected: number;
    totalProduction: number;
    lowPerformingCount: number;
    co2Reduction: number;
    equivalentTrees: number;
    efficiency: number;
}

// Helper to calculate stats for a given set of sites and readings
const calculateStatsForSites = (sites: Site[], readingsForMonth: Reading[]): StatData => {
    // Conversion factors
    const CO2_REDUCTION_FACTOR_TONNES_PER_KWH = 0.0007;
    const CO2_ABSORPTION_TONNES_PER_TREE_YEAR = 0.022;
    
    let totalCapacity = 0;
    let totalExpected = 0;
    let totalProduction = 0;
    let lowPerformingCount = 0;

    for (const site of sites) {
        totalCapacity += site.capacityKw;
        const reading = readingsForMonth.find(r => r.siteId === site.id);
        if (reading) {
            totalExpected += site.expectedMonthlyKwh;
            totalProduction += reading.valueKwh;
            const efficiency = (reading.valueKwh / site.expectedMonthlyKwh) * 100;
            if (efficiency <= 50) {
                lowPerformingCount++;
            }
        }
    }

    const co2Reduction = totalProduction * CO2_REDUCTION_FACTOR_TONNES_PER_KWH;
    const equivalentTrees = co2Reduction > 0 ? co2Reduction / CO2_ABSORPTION_TONNES_PER_TREE_YEAR : 0;
    const efficiency = totalExpected > 0 ? (totalProduction / totalExpected) * 100 : 0;

    return { totalCapacity, totalExpected, totalProduction, lowPerformingCount, co2Reduction, equivalentTrees, efficiency };
};

const StatCard = ({ icon, title, value, unit, colorClass }: { icon: React.ReactNode; title: string; value: string; unit: string; colorClass: string; }) => (
    <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-100 flex items-center space-x-3">
        <div className={`p-2 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">{title}</p>
            <p className="text-xl font-bold text-gray-800">
                {value} <span className="text-base font-medium text-gray-600">{unit}</span>
            </p>
        </div>
    </div>
);


// Reusable component to display the compact stat boxes for islands
const CompactStatDisplay: React.FC<{ stats: StatData }> = ({ stats }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 py-2">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Capacity</p>
            <p className="font-bold text-gray-800">{stats.totalCapacity.toFixed(2)} kWp</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Generation</p>
            <p className="font-bold text-gray-800">{stats.totalProduction.toLocaleString()} kWh</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Efficiency</p>
            <p className="font-bold text-gray-800">{stats.efficiency.toFixed(1)}%</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Low Performers</p>
            <p className="font-bold text-gray-800">{stats.lowPerformingCount}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">CO2 Saved</p>
            <p className="font-bold text-gray-800">{stats.co2Reduction.toFixed(1)} t</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Trees Planted</p>
            <p className="font-bold text-gray-800">{Math.round(stats.equivalentTrees).toLocaleString()}</p>
        </div>
    </div>
);

const BreakdownView: React.FC<BreakdownViewProps> = ({ sites, readings, userRole, selectedLocation }) => {
    const [expandedAtolls, setExpandedAtolls] = useState<{ [key: string]: boolean }>({});

    const toggleAtoll = (atoll: string) => {
        setExpandedAtolls(prev => ({ ...prev, [atoll]: !prev[atoll] }));
    };

    const { atollData } = useMemo(() => {
        const latestMonth = readings.length > 0
            ? readings.reduce((latest, current) => current.date > latest ? current.date : latest, readings[0].date)
            : null;

        if (!latestMonth) return { atollData: {} };

        const readingsForMonth = readings.filter(r => r.date === latestMonth);
        
        const groupedByAtoll: { [atoll: string]: Site[] } = {};
        for (const site of sites) {
            if (!groupedByAtoll[site.atoll]) {
                groupedByAtoll[site.atoll] = [];
            }
            groupedByAtoll[site.atoll].push(site);
        }

        const atollData: { [atoll: string]: { stats: StatData; islands: { [island: string]: { stats: StatData } } } } = {};
        
        for (const atoll in groupedByAtoll) {
            const atollSites = groupedByAtoll[atoll];
            const atollStats = calculateStatsForSites(atollSites, readingsForMonth);
            
            const groupedByIsland: { [island: string]: Site[] } = {};
            for (const site of atollSites) {
                if (!groupedByIsland[site.island]) {
                    groupedByIsland[site.island] = [];
                }
                groupedByIsland[site.island].push(site);
            }

            const islandData: { [island: string]: { stats: StatData } } = {};
            for (const island in groupedByIsland) {
                const islandSites = groupedByIsland[island];
                const islandStats = calculateStatsForSites(islandSites, readingsForMonth);
                islandData[island] = { stats: islandStats };
            }
            
            atollData[atoll] = { stats: atollStats, islands: islandData };
        }

        return { atollData };
    }, [sites, readings]);
    
    const allAtollNames = Object.keys(atollData).sort();

    const filteredAtollNames = useMemo(() => {
        if (userRole === Role.ADMIN || selectedLocation === 'all' || !selectedLocation) {
            return allAtollNames;
        }
        // For operators, only show the atoll they are logged into
        const selectedAtoll = selectedLocation.split('.')[0];
        return allAtollNames.filter(atoll => atoll === selectedAtoll);

    }, [userRole, selectedLocation, allAtollNames]);


    if (filteredAtollNames.length === 0) {
        return null;
    }
    
    return (
        <div>
            <h3 className="text-2xl font-bold text-brand-blue">Atoll Summaries</h3>
            <div className="space-y-8 mt-4">
                {filteredAtollNames.map(atoll => {
                    const atollStats = atollData[atoll].stats;
                    return (
                        <div key={atoll} className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-brand-blue">{atoll} Atoll Summary</h4>
                                <button 
                                    onClick={() => toggleAtoll(atoll)}
                                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition text-sm"
                                >
                                    <span>{expandedAtolls[atoll] ? 'Hide Islands' : 'Show Islands'}</span>
                                    <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedAtolls[atoll] ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4">
                                <StatCard 
                                    icon={<ServerIcon className="h-5 w-5 text-white"/>} 
                                    title="Total Capacity"
                                    value={atollStats.totalCapacity.toFixed(2)}
                                    unit="kWp"
                                    colorClass="bg-purple-500"
                                />
                                <StatCard 
                                    icon={<ZapIcon className="h-5 w-5 text-white"/>} 
                                    title="Total Generation"
                                    value={atollStats.totalProduction.toLocaleString()}
                                    unit="kWh"
                                    colorClass="bg-green-500"
                                />
                                <StatCard 
                                    icon={<SunIcon className="h-5 w-5 text-white"/>} 
                                    title="Overall Efficiency"
                                    value={atollStats.efficiency.toFixed(1)}
                                    unit="%"
                                    colorClass="bg-blue-500"
                                />
                                <StatCard 
                                    icon={<AlertTriangleIcon className="h-5 w-5 text-white"/>} 
                                    title="Low Performing Sites"
                                    value={atollStats.lowPerformingCount.toString()}
                                    unit="sites"
                                    colorClass={atollStats.lowPerformingCount > 0 ? "bg-red-500" : "bg-yellow-500"}
                                />
                                <StatCard
                                    icon={<WindIcon className="h-5 w-5 text-white" />}
                                    title="CO2 Reductions"
                                    value={atollStats.co2Reduction.toFixed(1)}
                                    unit="tonnes"
                                    colorClass="bg-gray-500"
                                />
                                <StatCard
                                    icon={<LeafIcon className="h-5 w-5 text-white" />}
                                    title="Equivalent Trees"
                                    value={Math.round(atollStats.equivalentTrees).toLocaleString()}
                                    unit="trees"
                                    colorClass="bg-teal-500"
                                />
                            </div>

                            {/* Island Breakdown (Conditional) */}
                            {expandedAtolls[atoll] && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <h5 className="font-bold text-lg text-gray-700 mb-2">Island Breakdown for {atoll} Atoll</h5>
                                    <div className="space-y-4">
                                        {Object.keys(atollData[atoll].islands).sort().map(island => (
                                            <div key={island} className="pl-4 border-l-4 border-brand-yellow">
                                                <h6 className="font-semibold text-gray-600">{island}</h6>
                                                <CompactStatDisplay stats={atollData[atoll].islands[island].stats} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BreakdownView;