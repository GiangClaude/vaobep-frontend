import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`, 
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token'); // Xóa token cũ
            window.dispatchEvent(new Event('auth_unauthorized'));
        }
        return Promise.reject({
            success: false,
            message: error.response?.data?.message || 'Không thể kết nối đến máy chủ.',
            status: error.response?.status
        });
    }
);

export default apiClient;