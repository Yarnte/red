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
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Site Name</label>
                        {/*- FIX: Replaced non-standard `input-style` class with Tailwind CSS classes */}
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    </div>
                    <div>
                        <label htmlFor="atoll" className="block text-sm font-medium text-gray-700">Atoll</label>
                        {/*- FIX: Replaced non-standard `input-style` class with Tailwind CSS classes */}
                        <input type="text" id="atoll" value={atoll} onChange={e => setAtoll(e.target.value)} placeholder="e.g., K" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    </div>
                    <div>
                        <label htmlFor="island" className="block text-sm font-medium text-gray-700">Island</label>
                        {/*- FIX: Replaced non-standard `input-style` class with Tailwind CSS classes */}
                        <input type="text" id="island" value={island} onChange={e => setIsland(e.target.value)} placeholder="e.g., Male" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    </div>
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity (kWp)</label>
                        {/*- FIX: Replaced non-standard `input-style` class with Tailwind CSS classes */}
                        <input type="number" id="capacity" value={capacityKw} onChange={e => setCapacityKw(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    </div>
                    <div>
                        <label htmlFor="meter" className="block text-sm font-medium text-gray-700">Production Meter No.</label>
                        {/*- FIX: Replaced non-standard `input-style` class with Tailwind CSS classes */}
                        <input type="text" id="meter" value={meterNumber} onChange={e => setMeterNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    </div>
                    <div>
                        <label htmlFor="commissioned" className="block text-sm font-medium text-gray-700">Commissioned Date</label>
                        {/*- FIX: Replaced non-standard `input-style` class with Tailwind CSS classes */}
                        <input type="text" id="commissioned" value={commissionedDate} onChange={e => setCommissionedDate(e.target.value)} placeholder="e.g., 1-Jan-24" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" required />
                    </div>
                    <div>
                        <label htmlFor="gps" className="block text-sm font-medium text-gray-700">GPS Coordinates (Optional)</label>
                        {/*- FIX: Replaced non-standard `input-style` class with Tailwind CSS classes */}
                        <input type="text" id="gps" value={gpsCoordinates} onChange={e => setGpsCoordinates(e.target.value)} placeholder="e.g., 4.441086, 73.714748" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition">Save Site</button>
                    </div>
                </form>
            </div>
            {/*- FIX: Removed non-standard <style jsx> tag which is not supported in this environment. */}
        </div>
    );
};

export default AddSiteModal;