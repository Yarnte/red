
import React, { useContext } from 'react';
import { AuthContext } from '../App';
import { LogOutIcon } from './Icons';

const Header: React.FC = () => {
    const authContext = useContext(AuthContext);

    return (
        <header className="bg-cyan-600 shadow-md text-white sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div>
                        <h1 className="text-xl font-bold tracking-wider">Renewable Energy Department</h1>
                        <p className="text-sm">State Electric Company Limited</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:block">Welcome, <span className="font-semibold">{authContext?.user?.name}</span></span>
                        <button
                            onClick={authContext?.logout}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white transition bg-cyan-700 rounded-md hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyan-600 focus:ring-white"
                        >
                            <LogOutIcon className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;