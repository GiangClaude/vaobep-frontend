import apiClient from "./index";

const recipeApi = {
    getFeatureRecipes: async () => {
        const response = await apiClient.get('/recipes/feature');
        return response;
    },

    getRecentlyRecipes: async () => {
        const response = await apiClient.get('/recipes/recently');
        return response;
    },

    getOwnerRecipe: async () => {
        const response = await apiClient.get('/recipes/owner');
        return response;
    },

    getRecipeById: async (id) => {
        const response = await apiClient.get(`/recipes/${id}`);
        return response;
    },

    createRecipe: async (formData) => {
        const response = await apiClient.post('/recipes/create', formData);
        return response;
    },

    updateRecipe: async (recipeId, formData) => {
        const response = await apiClient.put(`/recipes/update/${recipeId}`, formData);
        return response;
    },

    deleteRecipe: async (id) => {
        const response = await apiClient.delete(`/recipes/delete/${id}`);
        return response;
    },

    getPreviewComments: async (recipeId) => {
        const response = await apiClient.get(`/recipes/${recipeId}/preview-comments`);
        return response;
    },

    changeStatus: async (recipeId, newStatus) => {
        const response = await apiClient.patch(`/recipes/status/${recipeId}`, { status: newStatus });
        return response;
    },

    getAllRecipes: async (params) => {
        const response = await apiClient.get('/recipes', {params});
        return response;
    },
    
    getSavedRecipes: async (params) => {
        const response = await apiClient.get('/recipes/saved', { params });
        return response;
    }
    ,
    getUserRecipes: async (userId) => {
        const response = await apiClient.get(`/recipes/user/${userId}`);
        return response;
    }
    ,
    searchSimple: async (keyword) => {
        const response = await apiClient.get('/recipes/search/simple', { params: { keyword } });
        return response;
    }
}
export default recipeApi;