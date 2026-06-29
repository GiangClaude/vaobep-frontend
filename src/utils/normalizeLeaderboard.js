import { getAvatarUrl, getRecipeImageUrl } from "./imageHelper";

/**
 * Chuẩn hóa dữ liệu Recipe từ Leaderboard
 */
export const normalizeRankedRecipe = (item, isCurrentMonth) => {
    const data = isCurrentMonth ? item : item.snapshot_data;
    
    return {
        id: isCurrentMonth ? item.recipe_id : item.entity_id,
        score: isCurrentMonth ? item.point : item.score,
        
        title: data.title || "Công thức không tên",
        coverImage: getRecipeImageUrl(
            isCurrentMonth ? item.recipe_id : item.entity_id, 
            data.cover_image
        ),
        
        authorId: data.author_id,
        authorName: data.author_name || "Thành viên Bếp",
        authorAvatar: getAvatarUrl(data.author_id, data.author_avatar),
        
        likes: Number(data.like_count) || 0,
        comments: Number(data.comment_count) || 0,
        rating: Number(data.rating_avg_score || 0).toFixed(1),
        
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
    };
};

/**
 */
export const normalizeRankedUser = (item, isCurrentMonth) => {
    const data = isCurrentMonth ? item : item.snapshot_data;

    return {
        id: isCurrentMonth ? item.user_id : item.entity_id,
        score: isCurrentMonth ? item.rank_point : item.score,
        
        fullName: data.full_name || "Thành viên Bếp",
        avatar: getAvatarUrl(
            isCurrentMonth ? item.user_id : item.entity_id, 
            data.avatar
        ),
        bio: data.bio || "Chưa có thông tin",
        
        totalRecipes: Number(data.total_recipes) || 0,
        newRecipes: Number(data.new_recipes_this_month || data.new_recipes) || 0,
        totalFollowers: Number(data.total_followers) || 0,
    };
};