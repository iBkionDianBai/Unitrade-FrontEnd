// ibkiondianbai/unitrade-frontend/.../components/ProtectedRoute.tsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useContext(AppContext);
    const location = useLocation();

    if (!user) {
        // Redirect to auth page, but save the current location they were trying to access
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;