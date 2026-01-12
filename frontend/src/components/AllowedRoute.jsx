import { Outlet } from "react-router-dom";
import getUserRole from "./GetUserRole";


const AllowedRoute = ({allowedRoles}) => {
    const role = getUserRole();
    console.log("AllowedRoute role: ", role);
    // Outlet is the child component
    return (
        allowedRoles.includes(role) ? <Outlet /> :null
    )
}


export default AllowedRoute;