import React, { useState, useMemo, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getUserProfile } from '../services/dataService';
import { SITES } from '../constants';
import { Role } from '../types';
import { SunIcon } from './Icons';

// Hardcoded emails matching your Firebase Authentication
const ADMIN_EMAIL = 'administrator@stelco.com.mv';
const OPERATOR_EMAIL = 'operator@stelco.com.mv';

const LoginScreen: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);
    const [password, setPassword] = useState('');
    const [selectedIsland, setSelectedIsland] = useState<string>('all');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Use the local constant for the island list to prevent permission errors before login.
    const availableIslands = useMemo(() => {
        const islands = ['all', ...Array.from(new Set(SITES.map((site) => `${site.atoll}. ${site.island}`))).sort()];
        return selectedRole === Role.USER ? islands.filter(i => i !== 'all') : islands;
    }, [selectedRole]);

    useEffect(() => {
        if (selectedRole === Role.USER && availableIslands.length > 0) {
             setSelectedIsland(availableIslands[0]);
        } else if (selectedRole === Role.ADMIN) {
            setSelectedIsland('all');
        }
    }, [selectedRole, availableIslands]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            setError('Password is required.');
            return;
        }
        setIsLoading(true);
        setError('');

        const emailToUse = selectedRole === Role.ADMIN ? ADMIN_EMAIL : OPERATOR_EMAIL;

        try {
            if (selectedRole === Role.USER && (selectedIsland === 'all' || !selectedIsland)) {
                 throw new Error('Operators must select a specific island.');
            }

            // Step 1: Authenticate with Firebase Auth using the entered password
            const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
            
            // Step 2: Verify user profile
            const userProfile = await getUserProfile(userCredential.user.uid);
            if (!userProfile) {
                await auth.signOut();
                throw new Error(`Authentication successful, but user profile not found (UID: ${userCredential.user.uid}). Check Firestore.`);
            }
            
            localStorage.setItem('selectedIsland', selectedIsland);

        } catch (err: any) {
            console.error(err);
             if (err.message && (err.message.includes('user profile not found') || err.message.includes('specific island'))) {
                setError(err.message);
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Incorrect password.');
            } else {
                 setError('An unknown error occurred during login.');
            }
            localStorage.removeItem('selectedIsland');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <SunIcon className="w-16 h-16 mx-auto text-brand-yellow" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-blue">Solar PV Monitoring System</h1>
                    <p className="mt-2 text-lg text-gray-600">Renewable Energy Department</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Login As</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <button
                                type="button"
                                onClick={() => setSelectedRole(Role.ADMIN)}
                                className={`flex-1 px-4 py-2 text-sm font-medium border transition-colors ${selectedRole === Role.ADMIN ? 'bg-brand-blue text-white border-brand-blue z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue`}
                            >
                                Administrator
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole(Role.USER)}
                                className={`-ml-px flex-1 px-4 py-2 text-sm font-medium border transition-colors ${selectedRole === Role.USER ? 'bg-brand-blue text-white border-brand-blue z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} rounded-r-md focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue`}
                            >
                                Operator
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            id="password-input" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md" 
                            placeholder="Enter your password" 
                            required 
                        />
                    </div>

                     <div>
                        <label htmlFor="island-select" className="block text-sm font-medium text-gray-700">Select Island to View</label>
                        <select id="island-select" value={selectedIsland} onChange={(e) => setSelectedIsland(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                           {availableIslands.map((island) => (
                                <option key={island} value={island}>
                                    {island === 'all' ? 'All Islands' : island}
                                </option>
                            ))}
                        </select>
                         <p className="mt-1 text-xs text-gray-500">Operators will be restricted to their assigned island.</p>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="w-full px-4 py-3 text-lg font-semibold text-white bg-brand-blue rounded-lg hover:bg-brand-blue-light disabled:bg-gray-400">
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
