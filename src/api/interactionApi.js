import apiClient from "./index";

const interactionApi = {
    getInteractionState: async (postId, postType = 'recipe') => {
        const response = await apiClient.get('/interaction/state', {
            params: { postId, postType }
        });
        return response;
    },

    toggleLike: async (postId, postType = 'recipe') => {
        const response = await apiClient.post('/interaction/like', { postId, postType });
        return response;
    },

    toggleSave: async (postId, postType = 'recipe') => {
        const response = await apiClient.post('/interaction/save', { postId, postType });
        return response;
    },

    postComment: async (postId, content, postType = 'recipe', parentId = null) => {
        const response = await apiClient.post('/interaction/comment', { postId, postType, content, parentId });
        return response;
    },

    getComments: async (postId, postType = 'recipe', page = 1) => {
        const response = await apiClient.get('/interaction/comments', {
            params: { postId, postType, page, limit: 10 }
        });
        return response;
    },

    getReplies: async (parentId) => {
        const response = await apiClient.get(`/interaction/comments/${parentId}/replies`);
        return response;
    },

    updateComment: async (commentId, content) => {
        const response = await apiClient.put(`/interaction/comment/${commentId}`, { content });
        return response;
    },

    deleteComment: async (commentId) => {
        const response = await apiClient.delete(`/interaction/comment/${commentId}`);
        return response;
    },

    ratePost: async (postId, postType = 'recipe', score) => {
        const response = await apiClient.post('/interaction/rate', { postId, score, postType });
        return response;
    },

    reportPost: async (postId, reason, postType = 'recipe') => {
        const payload = { postId: String(postId), postType, reason };
        const response = await apiClient.post('/interaction/report', payload);
        return response;
    },

    followUser: async (followingId) => {
        const response = await apiClient.post('/interaction/follow', { followingId });
        return response;
    }
};

export default interactionApi;