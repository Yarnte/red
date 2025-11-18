import React, { useMemo } from 'react';
import { Site, Reading } from '../types';
import { ZapIcon, SunIcon, AlertTriangleIcon, WindIcon, LeafIcon, ServerIcon } from './Icons';

interface AggregateStatsProps {
    sites: Site[];
    readings: Reading[];
}

const AggregateStats: React.FC<AggregateStatsProps> = ({ sites, readings }) => {
    const CO2_REDUCTION_FACTOR_TONNES_PER_KWH = 0.0007;
    const CO2_ABSORPTION_TONNES_PER_TREE_YEAR = 0.022;

    const latestMonth = useMemo(() => {
        if (readings.length === 0) return null;
        return readings.reduce((latest, current) => (current.date > latest ? current.date : latest), readings[0].date);
    }, [readings]);

    const stats = useMemo(() => {
        const initialStats = { totalExpected: 0, totalProduction: 0, lowPerformingCount: 0, co2Reduction: 0, equivalentTrees: 0, totalCapacity: 0 };
        if (!latestMonth) return initialStats;

        const readingsForLatestMonth = readings.filter(r => r.date === latestMonth);
        const siteIdsWithReadings = new Set(readingsForLatestMonth.map(r => r.siteId));

        let totalCapacity = 0;
        let totalExpected = 0;
        let totalProduction = 0;
        let lowPerformingCount = 0;

        for (const site of sites) {
            totalCapacity += site.capacityKw;
            if (siteIdsWithReadings.has(site.id)) {
                const reading = readingsForLatestMonth.find(r => r.siteId === site.id);
                if (reading) {
                    totalExpected += site.expectedMonthlyKwh;
                    totalProduction += reading.valueKwh;
                    if (site.expectedMonthlyKwh > 0 && (reading.valueKwh / site.expectedMonthlyKwh) * 100 <= 50) {
                        lowPerformingCount++;
                    }
                }
            }
        }
        
        const co2Reduction = totalProduction * CO2_REDUCTION_FACTOR_TONNES_PER_KWH;
        const equivalentTrees = co2Reduction > 0 ? co2Reduction / CO2_ABSORPTION_TONNES_PER_TREE_YEAR : 0;

        return { totalExpected, totalProduction, lowPerformingCount, co2Reduction, equivalentTrees, totalCapacity };
    }, [sites, readings, latestMonth]);

    const overallEfficiency = stats.totalExpected > 0 ? (stats.totalProduction / stats.totalExpected) * 100 : 0;

    const StatCard = ({ icon, title, value, unit, colorClass }: { icon: React.ReactNode; title: string; value: string; unit: string; colorClass: string; }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value} <span className="text-lg font-medium text-gray-600">{unit}</span></p>
            </div>
        </div>
    );
    
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Overall Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <StatCard icon={<ServerIcon className="h-6 w-6 text-white"/>} title="Total Installed Capacity" value={stats.totalCapacity.toFixed(2)} unit="kWp" colorClass="bg-purple-500" />
                <StatCard icon={<ZapIcon className="h-6 w-6 text-white"/>} title="Total Generation" value={stats.totalProduction.toLocaleString()} unit="kWh" colorClass="bg-green-500" />
                <StatCard icon={<SunIcon className="h-6 w-6 text-white"/>} title="Overall Efficiency" value={overallEfficiency.toFixed(1)} unit="%" colorClass="bg-blue-500" />
                <StatCard icon={<AlertTriangleIcon className="h-6 w-6 text-white"/>} title="Low Performing Sites" value={stats.lowPerformingCount.toString()} unit="sites" colorClass={stats.lowPerformingCount > 0 ? "bg-red-500" : "bg-yellow-500"} />
                <StatCard icon={<WindIcon className="h-6 w-6 text-white" />} title="CO2 Reductions" value={stats.co2Reduction.toFixed(1)} unit="tonnes" colorClass="bg-gray-500" />
                <StatCard icon={<LeafIcon className="h-6 w-6 text-white" />} title="Equivalent Trees Planted" value={Math.round(stats.equivalentTrees).toLocaleString()} unit="trees" colorClass="bg-teal-500" />
            </div>
        </div>
    );
};

export default AggregateStats;