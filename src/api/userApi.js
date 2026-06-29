import apiClient from "./index";

const userApi = {
    getMyProfile: async () => {
        const response = await apiClient.get('user/me');
        return response;
    },

    searchUsers: async (params) => {
        const response = await apiClient.get('/user/search', { params });
        return response;
    },
    
    updateProfile: async (formData) => {
        const response = await apiClient.put('/user/me', formData);
        return response;
    },

    dailyCheckIn: async () => {
        return await apiClient.post('/user/points/check-in');
    },

    getPointHistory: async (params) => {
        return await apiClient.get('/user/points/history', { params });
    },

    giftPoints: async (data) => {
        return await apiClient.post('/user/points/gift', data);
    },

    getUserProfile: async (id) => {
        const response = await apiClient.get(`/user/${id}`);
        return response;
    },

    changePassword: async (data) => {
        const response = await apiClient.put('/user/change-password', data);
        return response;
    },
    
}
export default userApi;