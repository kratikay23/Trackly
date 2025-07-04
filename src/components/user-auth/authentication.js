// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { token } = useSelector((state) => state.userData);

    if (!token) {
        return <Navigate to="/sign-In" replace />;
    }

    return children || <Outlet />;
};

export default ProtectedRoute;
