import React, { useState } from 'react';
import { Site } from '../types';
import { XIcon } from './Icons';

interface AddSiteModalProps {
    onClose: () => void;
    onSave: (siteData: Omit<Site, 'id' | 'expectedMonthlyKwh'>) => void;
}

const AddSiteModal: React.FC<AddSiteModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [atoll, setAtoll] = useState('');
    const [island, setIsland] = useState('');
    const [capacityKw, setCapacityKw] = useState('');
    const [meterNumber, setMeterNumber] = useState('');
    const [commissionedDate, setCommissionedDate] = useState('');
    const [gpsCoordinates, setGpsCoordinates] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !atoll || !island || !capacityKw || !meterNumber || !commissionedDate) {
            setError('Please fill out all required fields.');
            return;
        }
        const capacity = parseFloat(capacityKw);
        if (isNaN(capacity) || capacity <= 0) {
            setError('Please enter a valid capacity.');
            return;
        }

        onSave({
            name,
            atoll,
            island,
            capacityKw: capacity,
            meterNumber,
            commissionedDate,
            gpsCoordinates,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-blue">Add New Site</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Site Name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    <input type="text" value={atoll} onChange={e => setAtoll(e.target.value)} placeholder="Atoll (e.g., K)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    <input type="text" value={island} onChange={e => setIsland(e.target.value)} placeholder="Island (e.g., Male)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    <input type="number" value={capacityKw} onChange={e => setCapacityKw(e.target.value)} placeholder="Capacity (kWp)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    <input type="text" value={meterNumber} onChange={e => setMeterNumber(e.target.value)} placeholder="Production Meter No." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    <input type="text" value={commissionedDate} onChange={e => setCommissionedDate(e.target.value)} placeholder="Commissioned Date (e.g., 1-Jan-24)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    <input type="text" value={gpsCoordinates} onChange={e => setGpsCoordinates(e.target.value)} placeholder="GPS Coordinates (Optional)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition">Save Site</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSiteModal;
