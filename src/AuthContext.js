import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import authApi from './api/authApi';
import { QUERY_KEYS } from './config/queryKeys';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: currentUser, isLoading, refetch } = useQuery({
        queryKey: [QUERY_KEYS.MY_PROFILE],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) return null;
            
            try {
                const response = await authApi.getMe(token);
                return response.success ? response.data : null;
            } catch (error) {
                return null;
            }
        },
        staleTime: 1000 * 60 * 5, 
        retry: false 
    });

    const setCurrentUser = (userData) => {
        queryClient.setQueryData([QUERY_KEYS.MY_PROFILE], userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        queryClient.setQueryData([QUERY_KEYS.MY_PROFILE], null);
    };

    useEffect(() => {
        const handleUnauthorized = () => logout();
        window.addEventListener('auth_unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
    }, []);

    const value = {
        currentUser: currentUser || null,
        setCurrentUser, 
        isLoading,
        logout, 
        refreshProfile: refetch
    };

    return (
        <AuthContext.Provider value={value}>
            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center bg-[#fff9f0] text-[#ff6b35] font-bold">
                    Đang tải thông tin hệ thống...
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};