import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoutes() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
 
}