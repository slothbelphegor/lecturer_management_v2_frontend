import { Outlet, Navigate } from "react-router-dom";
import getUserRole from "./GetUserRole";

const ProtectedRoute = ({allowedRoles}) => {
    const token = localStorage.getItem('Token');
    if (!allowedRoles)
        return (
         token ? <Outlet /> : <Navigate to="/login" />
    )
    const role = getUserRole();
    return(
         allowedRoles.includes(role) ? <Outlet /> :null
    )
}

export default ProtectedRoute;