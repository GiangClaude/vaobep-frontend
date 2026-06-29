const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getAvatarUrl = (userId, avatarName) => {
    if (!avatarName) return `/assets/avatar_default.png`;
    
    if (avatarName.toString().startsWith('http') || avatarName.toString().startsWith('blob:')) {
        return avatarName;
    }

    if (avatarName === 'default.png') return '/assets/avatar_default.png'; 

    return `${API_URL}/public/user/${userId}/${avatarName}`;
};

export const getRecipeImageUrl = (recipeId, cover_image) => {
    if (!cover_image) return '/assets/recipe_default.png'; 

    if (cover_image.toString().startsWith('http') || cover_image.toString().startsWith('blob:')) {
        return cover_image;
    }

    if (cover_image === 'default.png') return '/assets/avatar_default.png'; 

    return `${API_URL}/public/recipes/${recipeId}/${cover_image}`;
};

export const getArticleImageUrl = (articleId, cover_image) => {
    if (!cover_image) return '/assets/image_default.png'; 

    if (cover_image.toString().startsWith('http') || cover_image.toString().startsWith('blob:')) {
        return cover_image;
    }

    if (cover_image === 'default.png') return '/assets/image_default.png'; 

    return `${API_URL}/public/articles/${articleId}/${cover_image}`;
};

export const getDishImageUrl = (dishId, image_url) => {
    if (!image_url) return '/assets/dish_default.png';

    if (image_url.toString().startsWith('http') || image_url.toString().startsWith('blob:')) {
        return image_url;
    }

    return `${API_URL}/public/dictionaryDish/${dishId}/${image_url}`;
};