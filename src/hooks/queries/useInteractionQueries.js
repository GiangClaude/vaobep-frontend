import { useQuery } from '@tanstack/react-query';
import interactionApi from '../../api/interactionApi';
import { QUERY_KEYS } from '../../config/queryKeys';

export const useInteractionStateQuery = (postId, postType = 'recipe', isAuthenticated = false) => {
    return useQuery({
        queryKey: [QUERY_KEYS.INTERACTION_STATE, postType, postId],
        queryFn: async () => {
            const response = await interactionApi.getInteractionState(postId, postType);
            if (response.success) {
                return response.data;
            }
            return { liked: false, saved: false, rated: 0 };
        },
        enabled: !!postId && isAuthenticated,
    });
};

export const useCommentsQuery = (postId, postType = 'recipe', page = 1) => {
    return useQuery({
        queryKey: [QUERY_KEYS.RECIPE_COMMENTS, postType, postId, page],
        queryFn: async () => {
            const response = await interactionApi.getComments(postId, postType, page);
            if (response.success) {
                return response.data; 
            }
            return { comments: [], total: 0 };
        },
        enabled: !!postId,
    });
};

export const useRepliesQuery = (parentId, isExpanded) => {
    return useQuery({
        queryKey: [QUERY_KEYS.RECIPE_COMMENTS, 'replies', parentId],
        queryFn: async () => {
            const response = await interactionApi.getReplies(parentId);
            if (response.success) {
                return response.data;
            }
            return [];
        },
        enabled: !!parentId && isExpanded, 
    });
};