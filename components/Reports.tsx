
import React, { useState } from 'react';
import { Site, Reading } from '../types';
import { DownloadIcon } from './Icons';

interface ReportsProps {
    sites: Site[];
    readings: Reading[];
}

const Reports: React.FC<ReportsProps> = ({ sites, readings }) => {
    const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const generateCSV = () => {
        let filteredReadings: Reading[];
        let reportName = '';

        if (reportType === 'monthly') {
            filteredReadings = readings.filter(r => r.date.startsWith(selectedMonth));
            reportName = `Solar_Report_${selectedMonth}.csv`;
        } else {
            filteredReadings = readings.filter(r => r.date.startsWith(selectedYear.toString()));
            reportName = `Solar_Report_${selectedYear}.csv`;
        }

        if (filteredReadings.length === 0) {
            alert('No data available for the selected period.');
            return;
        }

        const headers = ['Site Name', 'Month', 'Production (kWh)', 'Expected (kWh)', 'Efficiency (%)'];
        const csvRows = [headers.join(',')];

        for (const reading of filteredReadings) {
            const site = sites.find(s => s.id === reading.siteId);
            if (site) {
                const efficiency = ((reading.valueKwh / site.expectedMonthlyKwh) * 100).toFixed(2);
                const row = [
                    `"${site.name.replace(/"/g, '""')}"`,
                    reading.date,
                    reading.valueKwh,
                    site.expectedMonthlyKwh,
                    efficiency,
                ].join(',');
                csvRows.push(row);
            }
        }
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', reportName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-brand-blue mb-6">Generate Reports</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <select 
                    value={reportType} 
                    onChange={e => setReportType(e.target.value as 'monthly' | 'yearly')}
                    className="p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                >
                    <option value="monthly">Monthly Report</option>
                    <option value="yearly">Yearly Report</option>
                </select>

                {reportType === 'monthly' ? (
                    <input 
                        type="month" 
                        value={selectedMonth} 
                        onChange={e => setSelectedMonth(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    />
                ) : (
                    <input 
                        type="number" 
                        value={selectedYear} 
                        onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
                        min="2020"
                        max={new Date().getFullYear()}
                        className="p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    />
                )}

                <button
                    onClick={generateCSV}
                    className="flex items-center space-x-2 w-full sm:w-auto justify-center px-6 py-2 bg-brand-yellow text-brand-blue font-bold rounded-md hover:opacity-90 transition shadow"
                >
                    <DownloadIcon className="h-5 w-5" />
                    <span>Download Report</span>
                </button>
            </div>
        </div>
    );
};

export default Reports;
