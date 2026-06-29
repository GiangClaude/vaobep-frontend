import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../../api/adminApi';
import { QUERY_KEYS } from '../../config/queryKeys';

export const useAdminUserMutations = () => {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
    
    return {
        toggleStatus: useMutation({ mutationFn: ({ userId, status }) => adminApi.updateUserStatus(userId, status), onSuccess: invalidate }),
        createUser: useMutation({ mutationFn: (data) => adminApi.createUser(data), onSuccess: invalidate }),
        updateUser: useMutation({ mutationFn: ({ userId, data }) => adminApi.updateUser(userId, data), onSuccess: invalidate })
    };
};

export const useAdminRecipeMutations = () => {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_RECIPES] });

    return {
        hideRecipe: useMutation({ mutationFn: ({ recipeId, status }) => adminApi.hideRecipe(recipeId, status), onSuccess: invalidate }),
        createRecipe: useMutation({ mutationFn: (formData) => adminApi.createRecipe(formData), onSuccess: invalidate }),
        updateRecipe: useMutation({ mutationFn: ({ recipeId, data }) => adminApi.updateRecipe(recipeId, data), onSuccess: invalidate })
    };
};

export const useAdminArticleMutations = () => {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_ARTICLES] });

    return {
        updateStatus: useMutation({ 
            mutationFn: ({ articleId, status }) => adminApi.updateArticleStatus(articleId, status), 
            onSuccess: invalidate 
        }),
        deleteArticle: useMutation({ 
            mutationFn: (articleId) => adminApi.deleteArticle(articleId), 
            onSuccess: invalidate 
        })
    };
};

export const useAdminProcessIngredientMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ingredientId, data }) => adminApi.processIngredient(ingredientId, data), // data: { action, calo_per_100g }
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_INGREDIENTS] })
    });
};

export const useAdminIngredientMutations = () => {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_INGREDIENTS] });

    return {
        createIngredient: useMutation({ mutationFn: (data) => adminApi.createIngredient(data), onSuccess: invalidate }),
        updateIngredient: useMutation({ mutationFn: ({ id, data }) => adminApi.updateIngredient(id, data), onSuccess: invalidate }),
        deleteIngredient: useMutation({ mutationFn: (id) => adminApi.deleteIngredient(id), onSuccess: invalidate })
    };
};

export const useAdminDictionaryMutations = () => {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DICTIONARY] });

    return {
        createDish: useMutation({ mutationFn: (formData) => adminApi.createDictionaryDish(formData), onSuccess: invalidate }),
        updateDish: useMutation({ mutationFn: ({ id, formData }) => adminApi.updateDictionaryDish(id, formData), onSuccess: invalidate }),
        deleteDish: useMutation({ mutationFn: (id) => adminApi.deleteDictionaryDish(id), onSuccess: invalidate })
    };
};

export const useAdminReportMutations = () => {
    const queryClient = useQueryClient();
    return {
        processReport: useMutation({
            mutationFn: (data) => adminApi.processReport(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REPORTS] });
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_RECIPES] });
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_ARTICLES] });
            }
        })
    };
};