import React from 'react';
import { Site, Reading } from '../types';
import { SunIcon, ZapIcon, AlertTriangleIcon } from './Icons';

interface SiteCardProps {
    site: Site;
    latestReading?: Reading;
    onClick: () => void;
}

const formatMonth = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

const SiteCard: React.FC<SiteCardProps> = ({ site, latestReading, onClick }) => {
    const hasReading = !!latestReading;
    const efficiency = hasReading && site.expectedMonthlyKwh > 0 ? (latestReading.valueKwh / site.expectedMonthlyKwh) * 100 : 0;

    let borderColorClass = 'border-gray-300';
    let efficiencyColor = 'text-gray-800';
    let alertIcon = null;

    if (hasReading) {
        if (efficiency <= 50) {
            borderColorClass = 'border-red-500';
            efficiencyColor = 'text-red-500';
            alertIcon = (<div className="flex items-center space-x-1 text-red-500 bg-red-100 px-2 py-1 rounded-full"><AlertTriangleIcon className="h-4 w-4" /><span className="text-xs font-semibold">LOW</span></div>);
        } else if (efficiency < 70) {
            borderColorClass = 'border-yellow-500';
            efficiencyColor = 'text-yellow-500';
        } else {
            borderColorClass = 'border-green-500';
            efficiencyColor = 'text-green-500';
        }
    }

    return (
        <div onClick={onClick} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1">
            <div className={`p-4 border-l-8 ${borderColorClass}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-brand-blue">{site.name}</h3>
                        <p className="text-sm text-gray-500">{site.atoll}. {site.island}</p>
                    </div>
                    {alertIcon}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Generation</p>
                        <p className="text-lg font-semibold text-gray-800 flex items-center justify-center space-x-1"><ZapIcon className="h-5 w-5 text-green-500" /><span>{latestReading ? `${latestReading.valueKwh.toLocaleString()} kWh` : 'N/A'}</span></p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Efficiency</p>
                        <p className={`text-lg font-semibold ${efficiencyColor} flex items-center justify-center space-x-1`}><SunIcon className="h-5 w-5" /><span>{latestReading ? efficiency.toFixed(1) + '%' : 'N/A'}</span></p>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-right">Latest Reading: {formatMonth(latestReading?.date)}</p>
            </div>
        </div>
    );
};

export default SiteCard;