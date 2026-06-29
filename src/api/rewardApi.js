import apiClient from './index';

export const rewardApi = {
    getMyRewards: () => apiClient.get('/rewards/my-rewards'),
    
    claimReward: (userRewardId) => apiClient.post('/rewards/claim', { userRewardId })
};