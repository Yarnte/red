
import React, { useState, useMemo, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { getUserProfile } from './services/dataService';
import { User } from './types';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

interface AuthContextType {
    user: User | null;
    island: string | null;
    firebaseUser: FirebaseUser | null;
    logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setFirebaseUser(user);
                const userProfile = await getUserProfile(user.uid);
                if (userProfile) {
                    setCurrentUser(userProfile);
                    // Default to 'all' so the dashboard shows all sites accessible to this user
                    setSelectedIsland('all');
                } else {
                    await auth.signOut();
                }
            } else {
                setFirebaseUser(null);
                setCurrentUser(null);
                setSelectedIsland(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await auth.signOut();
    };

    const contextValue = useMemo(() => ({
        user: currentUser,
        island: selectedIsland,
        firebaseUser,
        logout
    }), [currentUser, selectedIsland, firebaseUser]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen text-xl font-semibold bg-cyan-600 text-white">Loading Application...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {!currentUser ? <LoginScreen /> : <Dashboard />}
        </AuthContext.Provider>
    );
};

export default App;
