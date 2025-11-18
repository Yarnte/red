import React, { useState, useContext } from 'react';
import { Reading, Role } from '../types';
import { AuthContext } from '../App';
import { XIcon } from './Icons';

interface EditReadingModalProps {
    reading: Reading;
    onClose: () => void;
    onSave: (reading: Reading) => void;
}

const EditReadingModal: React.FC<EditReadingModalProps> = ({ reading, onClose, onSave }) => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    const [date, setDate] = useState(reading.date);
    const [valueKwh, setValueKwh] = useState(reading.valueKwh.toString());
    const [error, setError] = useState('');

    const isAdmin = user?.role === Role.ADMIN;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!date || !valueKwh) {
            setError('All fields are required.');
            return;
        }
        const numericValue = parseFloat(valueKwh);
        if (isNaN(numericValue) || numericValue < 0) {
            setError('Please enter a valid, non-negative production value.');
            return;
        }
        onSave({ ...reading, date, valueKwh: numericValue });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-blue">Edit Reading</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Month</label>
                        <input
                            type="month"
                            id="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            max={new Date().toISOString().slice(0, 7)}
                            disabled={!isAdmin}
                            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md disabled:bg-gray-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="reading" className="block text-sm font-medium text-gray-700">Monthly Production (kWh)</label>
                        <input
                            type="number"
                            id="reading"
                            value={valueKwh}
                            onChange={e => setValueKwh(e.target.value)}
                            placeholder="Export Counter Reading (2.8.0 / EXP)"
                            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition">Update Reading</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReadingModal;
