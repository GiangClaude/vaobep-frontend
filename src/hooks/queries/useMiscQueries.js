import { useQuery } from '@tanstack/react-query';
import tagApi from '../../api/tagApi';
import ingredientApi from '../../api/ingredientApi';
import unitApi from '../../api/unitApi';
import { rewardApi } from '../../api/rewardApi';
import { QUERY_KEYS } from '../../config/queryKeys';

export const useTagsQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.TAGS],
        queryFn: async () => {
            const response = await tagApi.getAllTags();
            return response.success ? response.data : (Array.isArray(response.data) ? response.data : []);
        },
        staleTime: Infinity,
    });
};

export const useMyRewardsQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.REWARDS, 'my_rewards'],
        queryFn: async () => {
            const response = await rewardApi.getMyRewards();
            return response.success ? response.data : [];
        }
    });
};

export const useIngredientsQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN_INGREDIENTS, 'all'],
        queryFn: async () => {
            const response = await ingredientApi.getAll();
            return response.success ? response.data : [];
        },
        staleTime: 1000 * 60 * 60, 
    });
};

export const useUnitsQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.UNITS],
        queryFn: async () => {
            const response = await unitApi.getAll();
            return response.success ? response.data : [];
        },
        staleTime: Infinity, 
    });
};