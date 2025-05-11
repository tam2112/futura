'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const t = useTranslations('Common');

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);
    }, []);

    const logout = () => {
        toast(t('signOutSuccess'));
        Cookies.remove('token');
        Cookies.remove('userId');
        setIsLoggedIn(false);
    };

    return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
