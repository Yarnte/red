import React, { useState, useMemo } from 'react';
import { User, Role } from '../types';
import { SITES } from '../constants';
import { SunIcon } from './Icons';

interface LoginScreenProps {
    users: User[];
    onLogin: (user: User, island: string) => void;
}

const allIslands = ['all', ...Array.from(new Set(SITES.map(site => `${site.atoll}. ${site.island}`)))];
const operatorIslands = allIslands.filter(i => i !== 'all');

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
    const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);
    const [selectedIsland, setSelectedIsland] = useState<string>('all');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        // If switching to Operator, ensure a valid island is selected
        if (role === Role.USER) {
            setSelectedIsland(operatorIslands[0] || '');
        } else {
            setSelectedIsland('all');
        }
    };
    
    const availableIslands = useMemo(() => {
        return selectedRole === Role.ADMIN ? allIslands : operatorIslands;
    }, [selectedRole]);

    const handleLogin = () => {
        setError('');
        const user = users.find(u => u.role === selectedRole);
        if (!user) {
            setError('Invalid role selected.');
            return;
        }

        if (selectedRole === Role.ADMIN) {
            if (password !== 'stelco') {
                setError('Invalid password for Administrator.');
                return;
            }
        }
        
        if(selectedRole === Role.USER && !selectedIsland) {
            setError('Please select an island to continue.');
            return;
        }

        onLogin(user, selectedIsland);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <SunIcon className="w-16 h-16 mx-auto text-brand-yellow" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-blue">Solar PV Monitoring System</h1>
                    <p className="mt-2 text-lg text-gray-600">Renewable Energy Department</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Login As</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <button
                                type="button"
                                onClick={() => handleRoleChange(Role.ADMIN)}
                                className={`flex-1 px-4 py-2 text-sm font-medium border transition-colors ${selectedRole === Role.ADMIN ? 'bg-brand-blue text-white border-brand-blue z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue`}
                            >
                                Administrator
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleChange(Role.USER)}
                                className={`-ml-px flex-1 px-4 py-2 text-sm font-medium border transition-colors ${selectedRole === Role.USER ? 'bg-brand-blue text-white border-brand-blue z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} rounded-r-md focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue`}
                            >
                                Operator
                            </button>
                        </div>
                    </div>
                    
                    {selectedRole === Role.ADMIN && (
                        <div>
                            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                                placeholder="Enter administrator password"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="island-select" className="block text-sm font-medium text-gray-700">
                            Select Island to View
                        </label>
                        <select
                            id="island-select"
                            value={selectedIsland}
                            onChange={(e) => setSelectedIsland(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                        >
                            {availableIslands.map(island => (
                                <option key={island} value={island}>
                                    {island === 'all' ? 'All Islands' : island}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <button
                        onClick={handleLogin}
                        className="w-full px-4 py-3 text-lg font-semibold text-white transition-all duration-300 bg-brand-blue rounded-lg hover:bg-brand-blue-light focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;