
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getUserProfile } from '../services/dataService';
import { Role } from '../types';
import { SunIcon } from './Icons';

const ADMIN_EMAIL = 'administrator@stelco.com.mv';
const OPERATOR_EMAIL = 'operator@stelco.com.mv';

const LoginScreen: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
            
            const userProfile = await getUserProfile(userCredential.user.uid);
            if (!userProfile) {
                await auth.signOut();
                throw new Error(`Authentication successful, but user profile not found (UID: ${userCredential.user.uid}). Check Firestore.`);
            }
            
            // Login successful; App.tsx handles the state update via onAuthStateChanged

        } catch (err: any) {
            console.error(err);
             if (err.message && err.message.includes('user profile not found')) {
                setError(err.message);
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Incorrect password.');
            } else {
                 setError('An unknown error occurred during login.');
            }
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
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue" 
                            placeholder="Enter your password" 
                            required 
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="w-full px-4 py-3 text-lg font-semibold text-white bg-brand-blue rounded-lg hover:bg-brand-blue-light disabled:bg-gray-400 transition-colors">
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
