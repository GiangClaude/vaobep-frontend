import { useQuery, useQueryClient} from '@tanstack/react-query';
import recipeApi from '../../api/recipeApi';
import { QUERY_KEYS } from '../../config/queryKeys';
import { normalizeRecipeList } from '../../utils/normalizeRecipe';

export const useRecipesListQuery = (params) => {
    return useQuery({
        queryKey: [QUERY_KEYS.RECIPES_LIST, params],
        queryFn: async () => {
            const response = await recipeApi.getAllRecipes(params);
            if (response.success) {
                return {
                    data: normalizeRecipeList(response.data || []),
                    pagination: response.meta
                };
            }
            throw new Error('Lỗi tải danh sách công thức');
        },
        placeholderData: (previousData) => previousData, 
    });
};

export const useRecentRecipesQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.RECENT_RECIPES],
        queryFn: async () => {
            const response = await recipeApi.getRecentlyRecipes();
            return response.success ? normalizeRecipeList(response.data) : [];
        }
    });
};

export const useOwnerRecipesQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.OWNER_RECIPES],
        queryFn: async () => {
            const response = await recipeApi.getOwnerRecipe();
            return response.success ? normalizeRecipeList(response.data) : [];
        }
    });
};

export const useSavedRecipesQuery = (sortParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SAVED_RECIPES, sortParams],
        queryFn: async () => {
            const response = await recipeApi.getSavedRecipes(sortParams);
            return response.success ? normalizeRecipeList(response.data) : [];
        }
    });
};

export const useFeaturedRecipesQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.FEATURED_RECIPES],
        queryFn: async () => {
            const response = await recipeApi.getFeatureRecipes();
            return response.success ? normalizeRecipeList(response.data) : [];
        }
    });
};

export const useRecipeByIdQuery = (id) => {
    return useQuery({
        queryKey: [QUERY_KEYS.RECIPE_DETAIL, id],
        queryFn: async () => {
            const response = await recipeApi.getRecipeById(id);
            if (response.success) {
                return normalizeRecipeList([response.data])[0]; 
            }
        }
    });
};
