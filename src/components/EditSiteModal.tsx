import React, { useState, useEffect } from 'react';
import { Site } from '../types';
import { XIcon } from './Icons';

interface EditSiteModalProps {
    site: Site;
    onClose: () => void;
    onSave: (site: Site) => void;
}

const EditSiteModal: React.FC<EditSiteModalProps> = ({ site, onClose, onSave }) => {
    const [name, setName] = useState(site.name);
    const [atoll, setAtoll] = useState(site.atoll);
    const [island, setIsland] = useState(site.island);
    const [meterNumber, setMeterNumber] = useState(site.meterNumber);
    const [commissionedDate, setCommissionedDate] = useState(site.commissionedDate);
    const [gpsCoordinates, setGpsCoordinates] = useState(site.gpsCoordinates || '');
    const [error, setError] = useState('');

    useEffect(() => {
        setName(site.name);
        setAtoll(site.atoll);
        setIsland(site.island);
        setMeterNumber(site.meterNumber);
        setCommissionedDate(site.commissionedDate);
        setGpsCoordinates(site.gpsCoordinates || '');
    }, [site]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !atoll || !island || !meterNumber || !commissionedDate) {
            setError('Please fill out all required fields.');
            return;
        }

        onSave({
            ...site,
            name,
            atoll,
            island,
            meterNumber,
            commissionedDate,
            gpsCoordinates,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-blue">Edit Site Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Site Name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    <input type="text" value={atoll} onChange={e => setAtoll(e.target.value)} placeholder="Atoll" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    <input type="text" value={island} onChange={e => setIsland(e.target.value)} placeholder="Island" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    <input type="number" value={site.capacityKw} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" disabled />
                    <input type="text" value={meterNumber} onChange={e => setMeterNumber(e.target.value)} placeholder="Meter No." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    <input type="text" value={commissionedDate} onChange={e => setCommissionedDate(e.target.value)} placeholder="Commissioned Date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    <input type="text" value={gpsCoordinates} onChange={e => setGpsCoordinates(e.target.value)} placeholder="GPS Coordinates" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition">Update Site</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSiteModal;
