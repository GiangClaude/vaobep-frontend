import apiClient from './index';

const unitApi = {
  getAll: () => {
    return apiClient.get('/units'); 
  },
};

export default unitApi;