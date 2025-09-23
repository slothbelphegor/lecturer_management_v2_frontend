import { jwtDecode } from 'jwt-decode';


export default function getUserRole() {
    const token = localStorage.getItem('Token')
    if (!token) return null;
    const decoded = jwtDecode(token)
    console.log("Role:", decoded['role'])
    return decoded['role']
}