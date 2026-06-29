import axios from 'axios';
import apiClient from "./index";
const API_URL = '/dictionary-dishes';

const dictionaryDishApi = {
    getMapSummary: async () =>{
        const response = await apiClient.get(`${API_URL}/map/summary`);
        return response;
    },

    getMapAllDishes: async () => {
        const response = await apiClient.get(`${API_URL}/map/all`);
        return response;
    },
    
    getDishDetail: async (id) => {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response;
    },

    voteRecipe: async (dishId, recipeId) => {
        const response = await apiClient.post(`${API_URL}/${dishId}/vote-recipe`, { recipeId });
        return response;
    }
};

export default dictionaryDishApi;