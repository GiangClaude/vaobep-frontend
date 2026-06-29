import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const AdminRoute = () => {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Đang kiểm tra quyền...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser.role !== 'admin') {
        return <Navigate to="/homepage" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;