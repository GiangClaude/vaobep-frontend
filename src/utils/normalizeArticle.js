import { getAvatarUrl, getArticleImageUrl, getRecipeImageUrl } from "./imageHelper";

export function normalizeArticle(a) {
  if (!a) return null;
  
  const rawRecipes = a.linked_recipes || a.recipes || [];
  const normalizedRecipes = rawRecipes.map(r => ({
    id: r.recipe_id || r.id,
    title: r.title || r.name || r.recipe_title || '',
    image: getRecipeImageUrl(r.recipe_id || r.id, r.cover_image || r.coverImage),
    authorName: r.author_name || r.authorName || ''
  }));

  return {
    id: a.article_id || a.id,
    title: a.title || "",
    excerpt: a.description || a.excerpt || "", 
    content: a.content || "",
    image: a.cover_image ? getArticleImageUrl(a.article_id || a.id, a.cover_image) : (a.image || null),
    status: a.status || "public",
    readTime: a.read_time ? `${a.read_time} phút` : "1 phút",
    tags: (a.tags || []).map(t => ({
      id: t.tag_id || t.id,
      name: t.name
    })),
    createdAt: a.created_at || null,
    date: a.created_at ? new Date(a.created_at).toLocaleDateString('vi-VN') : "",
    
    author: {
      id: a.author_id || a.user_id,
      name: a.author_name || "Chuyên gia",
      avatar: getAvatarUrl(a.author_id || a.user_id, a.author_avatar)
    },
    authorName: a.author_name || "Chuyên gia",
    authorAvatar: getAvatarUrl(a.author_id || a.user_id, a.author_avatar),

    category: (a.tags && a.tags.length > 0) ? a.tags[0].name : "Ẩm thực",
    recipes: normalizedRecipes,
    linkedRecipes: a.linked_recipes || [],

    isLiked: !!a.is_liked,
    isSaved: !!a.is_saved,
    likeCount: Number(a.like_count) || 0,
    commentCount: Number(a.comment_count || a.total_comments) || 0,
    reportCount: Number(a.report_count) || 0,
  };
}

export function normalizeArticleList(arr) {
  return Array.isArray(arr) ? arr.map(normalizeArticle) : [];
}