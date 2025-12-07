import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
    (config) => {
        // Token is automatically sent via cookies with withCredentials: true
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access - please login');
            // Optionally redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;
