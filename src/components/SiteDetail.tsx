import React, { useContext, useMemo } from 'react';
import { Site, Reading, Role } from '../types';
import { AuthContext } from '../App';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapPinIcon, EditIcon, ZapIcon, ServerIcon } from './Icons';

interface SiteDetailProps {
    site: Site;
    readings: Reading[];
    onBack: () => void;
    onEditReading: (reading: Reading) => void;
}

const formatMonthForTable = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const formatEnergy = (kwh: number) => {
    if (kwh >= 1000000) {
        return { value: (kwh / 1000000).toFixed(2), unit: 'GWh' };
    } else if (kwh >= 1000) {
        return { value: (kwh / 1000).toFixed(2), unit: 'MWh' };
    }
    return { value: kwh.toLocaleString(), unit: 'kWh' };
};

const SiteDetail: React.FC<SiteDetailProps> = ({ site, readings, onBack, onEditReading }) => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    
    const sortedReadings = [...readings].sort((a, b) => b.date.localeCompare(a.date));

    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const currentMonthReading = readings.find(r => r.date === currentMonthStr);
    const currentMonthProduction = currentMonthReading ? currentMonthReading.valueKwh : 0;
    const lifetimeProduction = readings.reduce((acc, curr) => acc + curr.valueKwh, 0);
    
    const lifetimeFormatted = formatEnergy(lifetimeProduction);
    const currentMonthFormatted = formatEnergy(currentMonthProduction);

    const chartData = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 12 }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const monthStr = `${year}-${month}`;
            const monthName = d.toLocaleString('default', { month: 'short', year: 'numeric' });
            const readingForMonth = readings.find(r => r.date === monthStr);
            return {
                date: monthName,
                Production: readingForMonth ? readingForMonth.valueKwh : null,
                Expected: site.expectedMonthlyKwh,
                '50% Threshold': site.expectedMonthlyKwh * 0.5,
            };
        }).reverse();
    }, [readings, site.expectedMonthlyKwh]);

    return (
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 items-start mb-6 gap-4">
                <div className="justify-self-start"><button onClick={onBack} className="flex items-center text-brand-blue hover:underline">&larr; Back to Dashboard</button></div>
                <div className="text-center order-first md:order-none">
                    <h2 className="text-3xl font-bold text-brand-blue">{site.name}</h2>
                    <p className="text-gray-600">{site.atoll}. {site.island} - {site.capacityKw} kWp Capacity</p>
                    <p className="text-sm text-gray-500 mt-1">Commissioned: {site.commissionedDate}</p>
                </div>
                <div className="justify-self-center md:justify-self-end text-center md:text-right">
                     <div className="inline-flex items-start space-x-2 text-sm">
                        <MapPinIcon className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                            <span className="font-semibold text-brand-blue">Site Location:</span>
                            {site.gpsCoordinates ? (<a href={`https://www.google.com/maps?q=${site.gpsCoordinates}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline block">{site.gpsCoordinates}</a>) : (<p className="text-gray-500">Not set</p>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-brand-blue flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Production</p>
                        <div className="mt-1">
                             <span className="text-sm text-brand-blue bg-blue-100 px-2 py-0.5 rounded-full font-medium">This Month</span>
                        </div>
                        <p className="text-4xl font-bold text-brand-blue mt-2">
                            {currentMonthFormatted.value} <span className="text-xl text-gray-500 font-medium">{currentMonthFormatted.unit}</span>
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full relative z-10">
                        <ZapIcon className="h-10 w-10 text-brand-blue" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-brand-blue flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Production</p>
                        <div className="mt-1">
                             <span className="text-sm text-brand-blue bg-blue-100 px-2 py-0.5 rounded-full font-medium">Lifetime</span>
                        </div>
                        <p className="text-4xl font-bold text-brand-blue mt-2">
                            {lifetimeFormatted.value} <span className="text-xl text-gray-500 font-medium">{lifetimeFormatted.unit}</span>
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full relative z-10">
                        <ServerIcon className="h-10 w-10 text-brand-blue" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Production Data Chart (kWh)</h3>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Production" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            <Line type="monotone" dataKey="Expected" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{r:4}} />
                            <Line type="monotone" dataKey="50% Threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">Reading History</h3>
                 <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production (kWh)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedReadings.map((reading, index) => {
                                const efficiency = site.expectedMonthlyKwh > 0 ? (reading.valueKwh / site.expectedMonthlyKwh) * 100 : 0;
                                const canEdit = user?.role === Role.ADMIN || (user?.role === Role.USER && index === 0);
                                return (
                                <tr key={reading.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatMonthForTable(reading.date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reading.valueKwh.toLocaleString()}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${efficiency < 50 ? 'text-red-600' : efficiency < 70 ? 'text-yellow-600' : 'text-green-600'}`}>{efficiency.toFixed(1)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{canEdit && (<button onClick={() => onEditReading(reading)} className="text-brand-blue hover:text-brand-blue-light" title="Edit Reading"><EditIcon className="h-5 w-5" /></button>)}</td>
                                </tr>);
                            })}
                        </tbody>
                    </table>
                 </div>
            </div>
        </main>
    );
};

export default SiteDetail;