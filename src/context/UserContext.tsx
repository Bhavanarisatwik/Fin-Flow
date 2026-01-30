import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { db } from '../services/storage';
import { useLiveQuery } from 'dexie-react-hooks';

interface UserContextType {
    user: UserProfile | null;
    isLoading: boolean;
    setUser: (user: UserProfile) => Promise<void>;
    updateUser: (updates: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    // specific query to get the single user
    const users = useLiveQuery(() => db.users.toArray());
    const user = users && users.length > 0 ? users[0] : null;

    useEffect(() => {
        // Artificial delay or check completion
        if (users !== undefined) setIsLoading(false);
    }, [users]);

    const setUser = async (newUser: UserProfile) => {
        await db.users.clear();
        await db.users.add(newUser);
    };

    const updateUser = async (updates: Partial<UserProfile>) => {
        if (!user) return;
        await db.users.update(user.id, updates);
    };

    const logout = async () => {
        await db.users.clear();
        // clear other tables if needed or keep for multi-user (not supported yet)
    };

    return (
        <UserContext.Provider value={{ user: user || null, isLoading, setUser, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

