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
    totalProduction: number;
    lowPerformingCount: number;
    co2Reduction: number;
    equivalentTrees: number;
    efficiency: number;
}

const calculateStatsForSites = (sites: Site[], readingsForMonth: Reading[]): StatData => {
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
            if (site.expectedMonthlyKwh > 0 && (reading.valueKwh / site.expectedMonthlyKwh) * 100 <= 50) {
                lowPerformingCount++;
            }
        }
    }

    const co2Reduction = totalProduction * CO2_REDUCTION_FACTOR_TONNES_PER_KWH;
    const equivalentTrees = co2Reduction > 0 ? co2Reduction / CO2_ABSORPTION_TONNES_PER_TREE_YEAR : 0;
    const efficiency = totalExpected > 0 ? (totalProduction / totalExpected) * 100 : 0;

    return { totalCapacity, totalProduction, lowPerformingCount, co2Reduction, equivalentTrees, efficiency };
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

const CompactStatDisplay: React.FC<{ stats: StatData }> = ({ stats }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 py-2">
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Capacity</p><p className="font-bold text-gray-800">{stats.totalCapacity.toFixed(2)} kWp</p></div>
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Generation</p><p className="font-bold text-gray-800">{stats.totalProduction.toLocaleString()} kWh</p></div>
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Efficiency</p><p className="font-bold text-gray-800">{stats.efficiency.toFixed(1)}%</p></div>
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Low Performers</p><p className="font-bold text-gray-800">{stats.lowPerformingCount}</p></div>
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">CO2 Saved</p><p className="font-bold text-gray-800">{stats.co2Reduction.toFixed(1)} t</p></div>
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">Trees Planted</p><p className="font-bold text-gray-800">{Math.round(stats.equivalentTrees).toLocaleString()}</p></div>
    </div>
);

const BreakdownView: React.FC<BreakdownViewProps> = ({ sites, readings, userRole, selectedLocation }) => {
    const [expandedAtolls, setExpandedAtolls] = useState<{ [key: string]: boolean }>({});
    const toggleAtoll = (atoll: string) => setExpandedAtolls(prev => ({ ...prev, [atoll]: !prev[atoll] }));

    const atollData = useMemo(() => {
        const latestMonth = readings.length > 0 ? readings.reduce((latest, current) => current.date > latest ? current.date : latest, readings[0].date) : null;
        if (!latestMonth) return {};

        const readingsForMonth = readings.filter(r => r.date === latestMonth);
        const groupedByAtoll: { [atoll: string]: { stats: StatData; islands: { [island: string]: StatData } } } = {};
        const atolls = [...new Set(sites.map(s => s.atoll))];

        atolls.forEach(atoll => {
            const atollSites = sites.filter(s => s.atoll === atoll);
            const atollStats = calculateStatsForSites(atollSites, readingsForMonth);
            const islands: { [island: string]: StatData } = {};
            const islandNames = [...new Set(atollSites.map(s => s.island))];

            islandNames.forEach(island => {
                const islandSites = atollSites.filter(s => s.island === island);
                islands[island] = calculateStatsForSites(islandSites, readingsForMonth);
            });
            groupedByAtoll[atoll] = { stats: atollStats, islands };
        });
        return groupedByAtoll;
    }, [sites, readings]);
    
    const filteredAtollNames = useMemo(() => {
        const allAtollNames = Object.keys(atollData).sort();
        if (userRole === Role.ADMIN || selectedLocation === 'all' || !selectedLocation) return allAtollNames;
        const selectedAtoll = selectedLocation.split('.')[0];
        return allAtollNames.filter(atoll => atoll === selectedAtoll);
    }, [userRole, selectedLocation, atollData]);

    if (filteredAtollNames.length === 0) return null;
    
    return (
        <div>
            <h3 className="text-2xl font-bold text-brand-blue">Atoll Summaries</h3>
            <div className="space-y-8 mt-4">
                {filteredAtollNames.map(atoll => (
                    <div key={atoll} className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xl font-bold text-brand-blue">{atoll} Atoll Summary</h4>
                            <button onClick={() => toggleAtoll(atoll)} className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition text-sm">
                                <span>{expandedAtolls[atoll] ? 'Hide Islands' : 'Show Islands'}</span>
                                <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedAtolls[atoll] ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4">
                            <StatCard icon={<ServerIcon className="h-5 w-5 text-white"/>} title="Total Capacity" value={atollData[atoll].stats.totalCapacity.toFixed(2)} unit="kWp" colorClass="bg-purple-500" />
                            <StatCard icon={<ZapIcon className="h-5 w-5 text-white"/>} title="Total Generation" value={atollData[atoll].stats.totalProduction.toLocaleString()} unit="kWh" colorClass="bg-green-500" />
                            <StatCard icon={<SunIcon className="h-5 w-5 text-white"/>} title="Overall Efficiency" value={atollData[atoll].stats.efficiency.toFixed(1)} unit="%" colorClass="bg-blue-500" />
                            <StatCard icon={<AlertTriangleIcon className="h-5 w-5 text-white"/>} title="Low Performing Sites" value={atollData[atoll].stats.lowPerformingCount.toString()} unit="sites" colorClass={atollData[atoll].stats.lowPerformingCount > 0 ? "bg-red-500" : "bg-yellow-500"} />
                            <StatCard icon={<WindIcon className="h-5 w-5 text-white" />} title="CO2 Reductions" value={atollData[atoll].stats.co2Reduction.toFixed(1)} unit="tonnes" colorClass="bg-gray-500" />
                            <StatCard icon={<LeafIcon className="h-5 w-5 text-white" />} title="Equivalent Trees" value={Math.round(atollData[atoll].stats.equivalentTrees).toLocaleString()} unit="trees" colorClass="bg-teal-500" />
                        </div>
                        {expandedAtolls[atoll] && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h5 className="font-bold text-lg text-gray-700 mb-2">Island Breakdown for {atoll} Atoll</h5>
                                <div className="space-y-4">
                                    {Object.keys(atollData[atoll].islands).sort().map(island => (
                                        <div key={island} className="pl-4 border-l-4 border-brand-yellow">
                                            <h6 className="font-semibold text-gray-600">{island}</h6>
                                            <CompactStatDisplay stats={atollData[atoll].islands[island]} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BreakdownView;