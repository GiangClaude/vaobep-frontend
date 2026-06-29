import apiClient from './index';

const ingredientApi = {
  getAll: () => {
    return apiClient.get('/ingredients');
  },
};

export default ingredientApi;