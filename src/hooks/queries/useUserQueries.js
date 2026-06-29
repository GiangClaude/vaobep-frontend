import { useQuery } from '@tanstack/react-query';
import userApi from '../../api/userApi';
import menuApi from '../../api/menuApi';
import recipeApi from '../../api/recipeApi';
import articleApi from '../../api/articleApi';
import { QUERY_KEYS } from '../../config/queryKeys';
import { normalizeRecipeList } from '../../utils/normalizeRecipe';
import { normalizeArticleList } from '../../utils/normalizeArticle';

export const useUserProfileQuery = (userId) => {
    return useQuery({
        queryKey: [QUERY_KEYS.USER_PROFILE, userId],
        queryFn: async () => {
           const [userRes, recipeRes, menuRes, articleRes] = await Promise.all([
                userApi.getUserProfile(userId).catch(() => null),
                recipeApi.getUserRecipes(userId).catch(() => null),
                menuApi.getPublicMenusByUser(userId).catch(() => null),
                articleApi.getUserArticles(userId).catch(() => null)
            ]);


            if (!userRes || !userRes.success) {
                throw new Error("Không thể tải thông tin người dùng.");
            }

            return {
                user: userRes.data,
                recipes: recipeRes?.success ? normalizeRecipeList(recipeRes.data) : [],
                menus: menuRes?.success ? menuRes.data : [],
                articles: articleRes?.success ? normalizeArticleList(articleRes.data) : [] 
            };
        },
        enabled: !!userId
    });
};

export const usePointsHistoryQuery = (page = 1, month = 'all') => {
    return useQuery({
        queryKey: [QUERY_KEYS.POINTS_HISTORY, page, month],
        queryFn: async () => {
            const response = await userApi.getPointHistory({ page, month });
            if (response.success) {
                return {
                    history: response.data.transactions,
                    pagination: {
                        total: response.data.total,
                        page: response.data.page,
                        totalPages: response.data.totalPages
                    }
                };
            }
            return { history: [], pagination: null };
        }
    });
};