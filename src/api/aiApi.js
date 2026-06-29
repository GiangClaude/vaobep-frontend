import apiClient from "./index";

const aiApi = {
    chat: async (payload) => {
        const response = await apiClient.post('/ai/chat', payload);
        return response;
    },

    summarize: async (payload) => {
        const response = await apiClient.post('/ai/summarize', payload);
        return response;
    },

    analyzePost: async (payload) => {
        const response = await apiClient.post('/ai/analyze-post', payload);
        return response;
    },

    clearHistory: async (payload) => {
        const response = await apiClient.delete('/ai/history', { data: payload });
        return response;
    }
};

export default aiApi;