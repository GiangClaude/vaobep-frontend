import apiClient from './index';

const adminApi = {
    // 1. Dashboard
    getStats: () => {
        return apiClient.get('/admin/stats');
    },

    // 2. Quản lý User
    getUsers: (params) => {
        return apiClient.get('/admin/users', { params });
    },
    
    createUser: (data) => {
        return apiClient.post('/admin/users', data);
    },

    updateUserStatus: (userId, status) => {
        return apiClient.put(`/admin/users/${userId}/status`, { status });
    },
    
    getUserDetail: (userId) => {
        return apiClient.get(`/admin/users/${userId}`);
    },

    getRecipes: (params) => {
        return apiClient.get('/admin/recipes', { params });
    },

    getRecipeDetail: (id) => apiClient.get(`/admin/recipes/${id}`),
    
    createRecipe: (formData) => {
        return apiClient.post('/admin/recipes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateRecipe: (id, data) => {
        return apiClient.put(`/admin/recipes/${id}`, data);
    },

    hideRecipe: (recipeId, status) => {
        return apiClient.put(`/admin/recipes/${recipeId}/hide`, { status });
    },

    getPendingIngredients: () => {
        return apiClient.get('/admin/ingredients/pending');
    },

    processIngredient: (ingredientId, data) => {
        return apiClient.put(`/admin/ingredients/${ingredientId}/process`, data);
    },

    getAllIngredients: async (page = 1, limit = 10, search = '', sortKey = 'name', sortOrder = 'ASC') => {
        try {
            const response = await apiClient.get('/admin/ingredients/all', {
                params: { page, limit, search, sortKey, sortOrder }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    createIngredient: async (data) => {
        try {
            const response = await apiClient.post('/admin/ingredients', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateIngredient: async (id, data) => {
        try {
            const response = await apiClient.put(`/admin/ingredients/${id}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    deleteIngredient: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/ingredients/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getAllCategories: async () => {
        try {
            const response = await apiClient.get('/admin/ingredients/categories');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getReports: () => {
        return apiClient.get('/admin/reports');
    },

    processReport: (data) => {
        return apiClient.post('/admin/reports/process', data);
    },

    getUserDetail: (userId) => {
        return apiClient.get(`/admin/users/${userId}`);
    },

    updateUser: (userId, data) => {
        return apiClient.put(`/admin/users/${userId}`, data);
    },

  
    getDictionaryDishes: async (page = 1, limit = 10, search = '', sortKey = 'created_at', sortOrder = 'DESC') => {
        try {
            const response = await apiClient.get('/admin/dictionary', {
                params: { page, limit, search, sortKey, sortOrder }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getDictionaryCountries: async () => {
        try {
            const response = await apiClient.get('/admin/dictionary/countries');
            return response;
        } catch (error) {
            throw error;
        }
    },

    createDictionaryDish: async (formData) => {
        try {
            const response = await apiClient.post('/admin/dictionary', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateDictionaryDish: async (id, formData) => {
        try {
            const response = await apiClient.put(`/admin/dictionary/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    deleteDictionaryDish: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/dictionary/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

  
    getArticles: async (page = 1, limit = 10, search = '', status = 'all', sortKey = 'created_at', sortOrder = 'DESC') => {
        try {
            const response = await apiClient.get('/admin/articles', {
                params: { page, limit, search, status, sortKey, sortOrder }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getArticleDetail: async (id) => {
        try {
            const response = await apiClient.get(`/admin/articles/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateArticleStatus: async (id, status) => {
        try {
            const response = await apiClient.put(`/admin/articles/${id}/status`, { status });
            return response;
        } catch (error) {
            throw error;
        }
    },

    deleteArticle: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/articles/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default adminApi;