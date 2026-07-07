import { useMutation, useQueryClient } from '@tanstack/react-query';
import interactionApi from '../../api/interactionApi';
import { QUERY_KEYS } from '../../config/queryKeys';

const POST_CONFIG_MAP = {
    recipe: {
        listKeys: [QUERY_KEYS.RECIPES_LIST, QUERY_KEYS.RECENT_RECIPES, QUERY_KEYS.OWNER_RECIPES, QUERY_KEYS.SAVED_RECIPES, QUERY_KEYS.FEATURED_RECIPES],
        detailKey: QUERY_KEYS.RECIPE_DETAIL,
        idFields: ['id', 'recipe_id']
    },
    dish: {
        listKeys: [QUERY_KEYS.DISH_MAP_ALL, QUERY_KEYS.DISH_MAP_SUMMARY],
        detailKey: QUERY_KEYS.DISH_DETAIL,
        idFields: ['id', 'dish_id']
    },
    article: {
        listKeys: [QUERY_KEYS.PUBLIC_ARTICLES, QUERY_KEYS.OWNER_ARTICLES, QUERY_KEYS.SAVED_ARTICLES, QUERY_KEYS.FEATURED_ARTICLES],
        detailKey: QUERY_KEYS.ARTICLE_DETAIL,
        idFields: ['id', 'article_id']
    }
};

const smartUpdateCache = (oldData, targetId, updates, postType) => {
    if (!oldData) return oldData;

    // Lấy các field làm khóa chính từ Config Map
    const idFields = POST_CONFIG_MAP[postType]?.idFields || ['id'];
    const isTarget = (item) => idFields.some(field => String(item[field]) === String(targetId));

    // TH 1: Cache là Mảng
    if (Array.isArray(oldData)) {
        return oldData.map(item => isTarget(item) ? { ...item, ...updates } : item);
    }

    // TH 2: Cache là Object Phân trang { data: [...], pagination: {...} }
    if (oldData.data && Array.isArray(oldData.data)) {
        return {
            ...oldData,
            data: oldData.data.map(item => isTarget(item) ? { ...item, ...updates } : item)
        };
    }

    // TH 3: Cache là Object Đơn
    if (typeof oldData === 'object' && isTarget(oldData)) {
        return { ...oldData, ...updates };
    }

    return oldData;
};

const updateCommentCountCache = (oldData, targetId, idFields, amount) => {
    if (!oldData) return oldData;
    const isTarget = (item) => idFields.some(field => String(item[field]) === String(targetId));

    const updateItem = (item) => {
        if (isTarget(item)) {
            // Cập nhật cả comment_count (snake_case) và commentCount (camelCase) đề phòng UI dùng 1 trong 2
            return {
                ...item,
                comment_count: Math.max(0, (item.comment_count || 0) + amount),
                commentCount: Math.max(0, (item.commentCount || 0) + amount)
            };
        }
        return item;
    };

    if (Array.isArray(oldData)) return oldData.map(updateItem);
    if (oldData.data && Array.isArray(oldData.data)) return { ...oldData, data: oldData.data.map(updateItem) };
    if (typeof oldData === 'object' && isTarget(oldData)) return updateItem(oldData);
    return oldData;
};


export const useToggleLikeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, postType }) => interactionApi.toggleLike(postId, postType),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERACTION_STATE] });
            
            const detailKey = POST_CONFIG_MAP[variables.postType]?.detailKey;
            if (detailKey) {
                queryClient.invalidateQueries({ queryKey: [detailKey] });
            }
        },
        onMutate: async ({ postId, postType, currentIsLiked, currentLikesCount }) => {
            const config = POST_CONFIG_MAP[postType];
            if (!config) return;

            const newIsLiked = !currentIsLiked;
            const newLikesCount = newIsLiked ? currentLikesCount + 1 : Math.max(0, currentLikesCount - 1);
            const updates = { is_liked: newIsLiked, isLiked: newIsLiked, likes: newLikesCount, like_count: newLikesCount, likeCount: newLikesCount };

            // Quét danh sách listKeys
            const allKeys = [...config.listKeys, config.detailKey];
            allKeys.forEach(baseKey => {
                queryClient.setQueriesData({ queryKey: [baseKey] }, (oldData) => smartUpdateCache(oldData, postId, updates, postType));
            });

            return { newIsLiked };
        },
        onError: (err, variables) => {
            const config = POST_CONFIG_MAP[variables.postType];
            if (!config) return;

            const allKeys = [...config.listKeys, config.detailKey];
            allKeys.forEach(baseKey => {
                queryClient.invalidateQueries({ queryKey: [baseKey] });
            });
        }
    });
};

export const useToggleSaveMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, postType }) => interactionApi.toggleSave(postId, postType),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERACTION_STATE] });
            const detailKey = POST_CONFIG_MAP[variables.postType]?.detailKey;
            if (detailKey) {
                queryClient.invalidateQueries({ queryKey: [detailKey] });
            }
        },
        onMutate: async ({ postId, postType, currentIsSaved }) => {
            const config = POST_CONFIG_MAP[postType];
            if (!config) return;

            const newIsSaved = !currentIsSaved;
            const updates = { is_saved: newIsSaved, isSaved: newIsSaved };

            const allKeys = [...config.listKeys, config.detailKey];
            allKeys.forEach(baseKey => {
                queryClient.setQueriesData({ queryKey: [baseKey] }, (oldData) => smartUpdateCache(oldData, postId, updates, postType));
            });
            return { newIsSaved };
        },
        onError: (err, variables) => {
            const config = POST_CONFIG_MAP[variables.postType];
            if (!config) return;
            const allKeys = [...config.listKeys, config.detailKey];
            allKeys.forEach(baseKey => {
                queryClient.invalidateQueries({ queryKey: [baseKey] });
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_RECIPES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_ARTICLES] });
        }
    });
};

export const usePostCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, content, postType, parentId }) => interactionApi.postComment(postId, content, postType, parentId),
        onSuccess: (data, variables) => {
           queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECIPE_COMMENTS] });

           const config = POST_CONFIG_MAP[variables.postType];
            if (config) {
                const allKeys = [...config.listKeys, config.detailKey];
                allKeys.forEach(baseKey => {
                    queryClient.setQueriesData({ queryKey: [baseKey] }, (oldData) => 
                        updateCommentCountCache(oldData, variables.postId, config.idFields, 1)
                    );
                });
            }
        }
    });
};

export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, postId, postType }) => interactionApi.deleteComment(commentId),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECIPE_COMMENTS] }); 

            const deletedCount = response?.data?.deletedCount || response?.deletedCount || 1;

            const config = POST_CONFIG_MAP[variables.postType];
            if (config) {
                const allKeys = [...config.listKeys, config.detailKey];
                allKeys.forEach(baseKey => {
                    queryClient.setQueriesData({ queryKey: [baseKey] }, (oldData) => 
                        updateCommentCountCache(oldData, variables.postId, config.idFields, -deletedCount)
                    );
                });
            }
        }
    });
};

export const useEditCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, content }) => interactionApi.updateComment(commentId, content),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECIPE_COMMENTS] });
        }
    });
};

export const useRatePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, postType, score }) => interactionApi.ratePost(postId, postType, score),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.INTERACTION_STATE, variables.postType, variables.postId] 
            });
            
            if (variables.postType === 'recipe') {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECIPE_DETAIL, variables.postId] });
            } else if (variables.postType === 'article') {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTICLE_DETAIL, variables.postId] });
            }
        }
    });
};

export const useReportPostMutation = () => {
    return useMutation({
        mutationFn: ({ postId, reason, postType }) => interactionApi.reportPost(postId, reason, postType)
    });
};

export const useFollowUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (followingId) => interactionApi.followUser(followingId),
        onSuccess: (data, followingId) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE, followingId] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_USERS] });
        }
    });
};