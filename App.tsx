
import React, { useState, useMemo } from 'react';
import { User } from './types';
import { USERS } from './constants';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

interface AuthContextType {
    user: User | null;
    island: string | null;
    login: (user: User, island: string) => void;
    logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedIsland, setSelectedIsland] = useState<string | null>(null);

    const login = (user: User, island: string) => {
        setCurrentUser(user);
        setSelectedIsland(island);
    };

    const logout = () => {
        setCurrentUser(null);
        setSelectedIsland(null);
    };

    const contextValue = useMemo(() => ({ user: currentUser, island: selectedIsland, login, logout }), [currentUser, selectedIsland]);

    if (!currentUser) {
        return <LoginScreen users={USERS} onLogin={login} />;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            <Dashboard />
        </AuthContext.Provider>
    );
};

export default App;