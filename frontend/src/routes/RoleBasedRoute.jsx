import { Navigate } from "react-router-dom";
import authService from "../services/authService";

function RoleBasedRoute({ children, allowedRoles }) {

    const user = authService.getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleBasedRoute;