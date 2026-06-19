// frontend/src/pages/RecipeDetailPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Clock, Users, ChefHat, Flame, Calendar, MessageCircle, Share2, ArrowLeft, Bookmark, TrendingUp, AlertCircle, Tag, X } from "lucide-react";
import ImageWithFallBack from "../component/figma/ImageWithFallBack";
import CommentSection from "../component/comment/CommentSection";
import AiSummaryBanner from "../component/common/AiSummaryBanner";
import { Footer } from "../component/common/Footer";
import { handleTagClick } from "../utils/tagUtils";
import { useRecipeDetailQuery } from '../hooks/queries/useRecipeDetailQuery';
import { useInteractionStateQuery } from '../hooks/queries/useInteractionQueries';
import { usePostActions } from '../hooks/ui/interaction/usePostActions';
import { useAuth } from '../AuthContext';
import { useAuthGuard } from '../hooks/ui/interaction/useAuthGuard';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { requireAuth } = useAuthGuard();

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const { data: recipe, isLoading, error } = useRecipeDetailQuery(id);

  const detailedIngredients = recipe?.detailedIngredients || [];
  const detailedSteps = recipe?.detailedSteps || [];
  const tags = recipe?.tags || [];

  const { data: interactionState } = useInteractionStateQuery(id, 'recipe', !!currentUser);
  const isLiked = interactionState?.liked !== undefined ? interactionState.liked : (recipe?.isLiked || false);
  const isSaved = interactionState?.saved !== undefined ? interactionState.saved : (recipe?.isSaved || false);
  const likesCount = recipe?.likes || 0;
  
  const { handleLike, handleSave, handleShare, handleReport } = usePostActions({
    id,
    type: 'recipe',
    isLiked: isLiked || false,
    likesCount: likesCount,
    isSaved: isSaved || false
  });

  /**
   * Hàm kiểm tra trạng thái đăng nhập và mở modal đánh giá món ăn
   */
  const handleOpenRatingModal = requireAuth(() => {
    setIsRatingModalOpen(true);
  });

  /**
   * Hàm xử lý gửi dữ liệu đánh giá món ăn lên hệ thống backend
   */
  const handleSubmitRating = () => {
    if (selectedRating === 0) return;
    console.log("Submit rating:", selectedRating);
    setIsRatingModalOpen(false);
  };

  if (isLoading) return <div className="min-h-screen bg-[#fff9f0] flex items-center justify-center">Đang tải...</div>;
  if (error || !recipe) return <div className="min-h-screen bg-[#fff9f0] flex items-center justify-center text-red-500">Lỗi: Không tìm thấy công thức</div>;

  const isAuthor = currentUser?.id === recipe.userId;

  return (
    <div className="min-h-screen bg-[#fff9f0]">
      <main className="container mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#ff6b35] mb-6">
          <ArrowLeft className="w-5 h-5" /> <span>Quay lại</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[30px] shadow-xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            <div className="relative h-[400px] lg:h-[500px]">
              <ImageWithFallBack src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute top-6 right-6 flex gap-3 items-center">
                <button onClick={handleLike} className={`p-3 rounded-full backdrop-blur-md shadow-lg ${isLiked ? "bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white" : "bg-white/90 text-[#7d5a3f]"}`}>
                  <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button onClick={handleSave} className={`p-3 rounded-full backdrop-blur-md shadow-lg ${isSaved ? "bg-[#ffc857] text-white" : "bg-white/90 text-[#7d5a3f]"}`}>
                  <Bookmark className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} />
                </button>
                <button onClick={isAuthor ? undefined : handleReport} disabled={isAuthor} className={`p-3 rounded-full backdrop-blur-md shadow-lg ${isAuthor ? 'opacity-50 cursor-not-allowed' : 'bg-white/90 text-red-500 hover:bg-red-50'}`}>
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h1 className="text-4xl mb-4 font-bold text-gray-800">{recipe.title}</h1>
              
              <div 
                className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-[#fff9f0] p-2 rounded-xl transition-all w-max border border-transparent hover:border-[#ffc857]/50"
                onClick={handleOpenRatingModal}
              >
                <div className="flex text-[#ffc857]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      fill={star <= Math.round(parseFloat(recipe.rating) || 0) ? "currentColor" : "none"} 
                      className="w-5 h-5" 
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-800">{recipe.rating}</span>
                <span className="text-[#7d5a3f] text-sm underline underline-offset-2">
                  ({recipe.ratingCount} đánh giá)
                </span>
              </div>


              <div className="flex items-center gap-3 mb-6"> 
                <ImageWithFallBack src={recipe.userAvatar} alt="Author" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                <div><p className="text-[#7d5a3f] text-xs font-bold uppercase">Tác giả</p><p className="font-semibold text-lg">{recipe.userName}</p></div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-[#fff9f0] px-4 py-2 rounded-full text-[#7d5a3f] text-sm font-medium border border-[#ffc857]/20">
                  <Clock className="w-4 h-4 text-[#ff6b35]" /> {recipe.cookTime} phút
                </div>
                <div className="flex items-center gap-2 bg-[#fff9f0] px-4 py-2 rounded-full text-[#7d5a3f] text-sm font-medium border border-[#ffc857]/20">
                  <Users className="w-4 h-4 text-[#ff6b35]" /> {recipe.servings} người
                </div>
                <div className="flex items-center gap-2 bg-[#fff9f0] px-4 py-2 rounded-full text-[#7d5a3f] text-sm font-medium border border-[#ffc857]/20">
                  <Flame className="w-4 h-4 text-[#ff6b35]" /> {recipe.calories} Calo
                </div>
                <div className="flex items-center gap-2 bg-[#fff9f0] px-4 py-2 rounded-full text-[#7d5a3f] text-sm font-medium border border-[#ffc857]/20">
                  <Calendar className="w-4 h-4 text-[#ff6b35]" /> {recipe.createdAt}
                </div>
              </div>


              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 items-center">
                  <Tag className="w-4 h-4 text-[#ff6b35] mr-1" />
                  {tags.map((tag) => (
                    <span 
                      key={tag.tag_id} 
                      onClick={() => handleTagClick(navigate, tag.tag_id, 'recipes')}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-bold border border-[#ff6b35]/20 shadow-sm transition-all hover:brightness-95 cursor-default"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="bg-[#fff9f0] p-6 rounded-2xl border border-[#ffc857]/20">
                <p className="text-[#7d5a3f] whitespace-pre-line text-sm">{recipe.detailedDescription}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[25px] shadow-lg p-8">
              <h2 className="text-2xl mb-6 flex items-center gap-3 font-bold text-gray-800"><ChefHat className="w-8 h-8 text-[#ff6b35]" /> Nguyên Liệu</h2>
              {detailedIngredients && detailedIngredients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#fff9f0] rounded-xl border border-transparent hover:border-[#ffc857]/50 transition-colors">
                      <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#ff6b35]" /><span className="font-medium text-gray-700">{ingredient.name}</span></div>
                      <span className="text-[#ff6b35] font-bold">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              ) : ( <p className="text-[#7d5a3f] italic">Chưa cập nhật nguyên liệu.</p> )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[25px] shadow-lg p-8">
              <h2 className="text-2xl mb-6 flex items-center gap-3 font-bold text-gray-800"><TrendingUp className="w-8 h-8 text-[#ff6b35]" /> Hướng Dẫn Thực Hiện</h2>
              <div className="space-y-8">
                {detailedSteps && detailedSteps.length > 0 ? (
                  detailedSteps.map((step) => (
                    <div key={step.step} className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f7931e] text-white flex items-center justify-center font-bold text-xl shadow-lg border-4 border-[#fff9f0]">{step.step}</div>
                      <div className="flex-grow">
                        <div className="bg-[#fff9f0] rounded-2xl p-6 relative">
                          <div className="absolute top-6 left-[-10px] w-4 h-4 bg-[#fff9f0] transform rotate-45"></div>
                          <p className="text-gray-800 leading-relaxed whitespace-pre-line font-medium">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : ( <p className="text-[#7d5a3f] italic">Chưa cập nhật hướng dẫn.</p> )}
              </div>
            </motion.div>
            
            <CommentSection postId={id} postType="recipe" />
          </div>

          <div className="lg:col-span-1">
            <AiSummaryBanner contextText={`Món: ${recipe.title}. Hướng dẫn: ${JSON.stringify(recipe.detailedSteps)}`} />
          </div>
        </div>
      </main>

      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl"
          >
            <button 
              onClick={() => setIsRatingModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">Đánh giá món ăn</h3>
            <p className="text-sm text-center text-[#7d5a3f] mb-6">Bạn cảm thấy công thức này như thế nào?</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-10 h-10 cursor-pointer transition-transform hover:scale-110 ${
                    star <= selectedRating ? "text-[#ffc857] fill-current" : "text-gray-300"
                  }`}
                  onClick={() => setSelectedRating(star)}
                />
              ))}
            </div>

            <button 
              onClick={handleSubmitRating}
              disabled={selectedRating === 0}
              className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
                selectedRating === 0 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-[#ff6b35] hover:bg-[#e85a25]"
              }`}
            >
              Gửi đánh giá
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}