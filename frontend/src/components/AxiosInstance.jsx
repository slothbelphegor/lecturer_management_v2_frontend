import { formHelperTextClasses } from '@mui/material';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

const baseUrl = "http://127.0.0.1:8000/"
const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
})

// Create a new instance for token refresh to avoid interceptors loop
const axiosRefresh = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});


// Function to check if token is expired
const isTokenExpired = (token) => {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp < Date.now() / 1000;
    } catch {
        return true;
    }
};


// Request interceptor to add token to every request
AxiosInstance.interceptors.request.use(
    async (config) => {
        // Add token to request header
        const token = localStorage.getItem('Token')
        // Check if the token is expired or not
        if (isTokenExpired(token)) {
            console.log("Token expired:", token);
            try {
                const refreshToken = localStorage.getItem('RefreshToken');
                if (!refreshToken) {
                    throw new Error("Refresh token not found");
                }

                const response =  await axiosRefresh.post('api/token/refresh/', {
                    refresh: refreshToken
                });

                localStorage.setItem('Token', response.data.access);
                console.log("Token refreshed successfully:", response.data.access);
                config.headers.Authorization = `Bearer ${response.data.access}`;
            } catch (error) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('Token');
                localStorage.removeItem('RefreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }   
        else if (token) {
            // If token is valid, set it in the header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Response interceptor to handle errors globally
AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // If the error is 401 and the request has not been retried yet
        if (!originalRequest && error.response?.status === 401) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('RefreshToken');
                if (!refreshToken) {
                    throw new Error("Refresh token not found");
                }

                const response = await axiosRefresh.post('api/token/refresh/', {
                    refresh: refreshToken
                });

                localStorage.setItem('Token', response.data.access);
                // Re-try the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return AxiosInstance(originalRequest);
            } catch (error) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('Token');
                localStorage.removeItem('RefreshToken');
                window.location.href = '/login';
                return Promise.reject(error);}
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;