import { jwtDecode } from 'jwt-decode';


export default function getUserRole() {
    const token = localStorage.getItem('Token')
    if (!token) return null;
    const decoded = jwtDecode(token)
    return decoded['role']
}