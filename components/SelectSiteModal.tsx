import React, { useState } from 'react';
import { Site } from '../types';
import { XIcon } from './Icons';

interface SelectSiteModalProps {
    sites: Site[];
    onClose: () => void;
    onSelect: (site: Site) => void;
}

const SelectSiteModal: React.FC<SelectSiteModalProps> = ({ sites, onClose, onSelect }) => {
    const [selectedSiteId, setSelectedSiteId] = useState<number | ''>(sites[0]?.id || '');
    const [error, setError] = useState('');

    const handleSelect = () => {
        setError('');
        if (!selectedSiteId) {
            setError('Please select a site to edit.');
            return;
        }
        const siteToEdit = sites.find(s => s.id === Number(selectedSiteId));
        if (siteToEdit) {
            onSelect(siteToEdit);
        } else {
            setError('Could not find the selected site.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-blue">Select Site to Edit</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="site-select" className="block text-sm font-medium text-gray-700">Site</label>
                        <select
                            id="site-select"
                            value={selectedSiteId}
                            onChange={(e) => setSelectedSiteId(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                        >
                            <option value="" disabled>Choose a site</option>
                            {sites.map(site => (
                                <option key={site.id} value={site.id}>{site.name}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Cancel</button>
                        <button type="button" onClick={handleSelect} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition">Edit Selected Site</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSiteModal;
