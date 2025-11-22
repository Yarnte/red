import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Site, Reading } from '../types';

interface PerformancePieChartProps {
    sites: Site[];
    readings: Reading[];
}

const PerformancePieChart: React.FC<PerformancePieChartProps> = ({ sites, readings }) => {
    
    const data = useMemo(() => {
        // 1. Find the latest month available in the readings
        if (readings.length === 0) return [];
        const latestMonth = readings.reduce((latest, current) => (current.date > latest ? current.date : latest), readings[0].date);

        // 2. Filter readings for that month
        const readingsForLatestMonth = readings.filter(r => r.date === latestMonth);

        let good = 0;
        let medium = 0;
        let low = 0;

        // 3. Categorize each site
        sites.forEach(site => {
            const reading = readingsForLatestMonth.find(r => r.siteId === site.id);
            
            if (!reading) {
                return;
            }

            const efficiency = site.expectedMonthlyKwh > 0 ? (reading.valueKwh / site.expectedMonthlyKwh) * 100 : 0;

            if (efficiency >= 70) {
                good++;
            } else if (efficiency >= 50) {
                medium++;
            } else {
                low++;
            }
        });

        // 4. Format for Recharts
        return [
            { name: 'Good (≥70%)', value: good, color: '#10b981' },   // Green
            { name: 'Medium (50-69%)', value: medium, color: '#f59e0b' }, // Yellow/Orange
            { name: 'Low (<50%)', value: low, color: '#ef4444' },    // Red
        ].filter(item => item.value > 0); // Only show categories that have sites

    }, [sites, readings]);

    if (data.length === 0) {
        return null; // Don't render if no data
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Performance Distribution</h3>
            <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => [`${value} Sites`, 'Count']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">Based on latest month data</p>
        </div>
    );
};

export default PerformancePieChart;