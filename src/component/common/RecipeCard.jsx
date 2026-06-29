import { useState } from "react";
import { Clock, Users, Heart, Star, Share2, ChefHat, MessageCircle, Bookmark, AlertCircle, Tag } from "lucide-react";
import { motion } from "motion/react"; 
import ImageWithFallBack from "../figma/ImageWithFallBack";
import { getAvatarUrl, getRecipeImageUrl } from "../../utils/imageHelper";
import { TagList } from "./tag/TagList";
import { usePostActions } from "../../hooks/ui/interaction/usePostActions";

export function RecipeCard({ recipe = {}, onClick, expandDirection = "right" }) {
  const {
    id, image, title, userName, userAvatar, cookTime, servings, likes, rating,
    isLiked, isSaved, description, ingredientNames, stepsCount, detailedSteps,
    calories, commentCount, 
    tags 
  } = recipe;


  const [isHovered, setIsHovered] = useState(false);

  const { handleLike, handleSave, handleShare, handleReport } = usePostActions({
    id,
    type: 'recipe',
    isLiked: isLiked,
    likesCount: likes,
    isSaved: isSaved
  });

  const displaySteps = stepsCount || (detailedSteps ? detailedSteps.length : 0);

  return (
      <motion.div
        initial={false}
        animate={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="cursor-pointer flex-shrink-0 relative mb-6 group w-full max-w-[640px] md:w-full h-full"
        style={{ zIndex: 50, position: 'relative' }}
        onClick={onClick}
      >
        <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_24px_-10px_rgba(255,117,31,0.2)] hover:shadow-[0_12px_32px_-10px_rgba(255,117,31,0.4)] border-2 border-transparent hover:border-orange-100 transition-all duration-300 h-full flex flex-col md:flex-row"
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col bg-white relative h-full">
            
            <div className="relative h-[220px] md:h-48 w-full overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 transform transition-transform duration-700 ease-out" style={{ transform: isHovered ? "scale(1.08) rotate(-1deg)" : "scale(1)" }}>
                <ImageWithFallBack src={image} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
              
              <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className="h-9 px-3.5 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow-orange-300/50 hover:-translate-y-1 hover:bg-orange-50 transition-all duration-300">
                  <Heart className={`w-4 h-4 transition-colors ${isLiked ? "text-[#ff751f] fill-[#ff751f]" : "text-gray-500"}`} />
                  <span className={`text-sm font-bold ${isLiked ? "text-[#ff751f]" : "text-gray-600"}`}>{likes}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full hover:-translate-y-1 hover:bg-orange-50 hover:text-[#ff751f] text-gray-500 transition-all duration-300 shadow-sm group-hover:opacity-100 opacity-0 transform translate-x-4 group-hover:translate-x-0">
                   <Share2 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleReport(); }} className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full hover:-translate-y-1 hover:bg-red-50 hover:text-red-500 text-gray-500 transition-all duration-300 shadow-sm group-hover:opacity-100 opacity-0 transform translate-x-4 group-hover:translate-x-0 delay-75">
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>

              <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full hover:-translate-y-1 hover:bg-orange-50 hover:shadow-orange-300/50 transition-all duration-300 shadow-sm z-10">
                  <Bookmark className={`w-4 h-4 ${isSaved ? "text-[#ff751f] fill-[#ff751f]" : "text-gray-500"}`} />
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-md pl-1 pr-3 py-1 rounded-full shadow-md border border-orange-50/50 hover:scale-105 transition-transform duration-300">
                <ImageWithFallBack src={userAvatar} alt={userName} className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" />
                <span className="text-xs text-gray-700 font-bold truncate max-w-[120px]">{userName}</span>
              </div>
            </div>

            <div className="p-4 pt-3 flex-grow flex flex-col">
              
              <h3 className="text-[17px] font-extrabold mb-2 line-clamp-2 min-h-[48px] text-gray-800 leading-snug group-hover:text-[#ff751f] transition-colors">
                {title}
              </h3>
              
              <div className="mb-3 h-[28px] flex items-center">
                <TagList tags={tags} maxDisplay={2} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-600 mt-auto">
                <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-xl border border-orange-100/50">
                  <Clock className="w-3.5 h-3.5 text-[#ff751f]" /><span>{cookTime} phút</span>
                </div>
                <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-xl border border-orange-100/50">
                  <Users className="w-3.5 h-3.5 text-[#ff751f]" /><span>{servings} người</span>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-xl border border-yellow-100/50">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /><span>{Math.round(rating*100)/100}</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden border-t-2 md:border-t-0 md:border-l-2 border-dashed border-orange-100 bg-gradient-to-br from-white to-orange-50/30 flex-shrink-0 w-full md:w-80 h-full ${expandDirection === 'left' ? 'md:order-first md:border-r-2 md:border-l-0' : ''}`}
          >
            <div className="p-5 h-full flex flex-col w-full">
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] leading-relaxed font-medium italic">
                  "{description}"
                </p>
              </div>
              
              <div className="mb-4 bg-white p-3 rounded-2xl shadow-sm border border-orange-50 h-[120px] flex flex-col overflow-hidden">
                <h4 className="text-sm mb-2 text-[#ff751f] flex items-center gap-1.5 font-bold uppercase tracking-wide flex-shrink-0">
                  <ChefHat className="w-4 h-4" /> Nguyên liệu chính
                </h4>
                <ul className="text-sm text-gray-600 font-medium space-y-2 flex-grow">
                  {ingredientNames && ingredientNames.length > 0
                    ? ingredientNames.slice(0, 3).map((ingredient, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)] flex-shrink-0"></span>
                          <span className="truncate">{ingredient}</span>
                        </li>
                      ))
                    : <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>Đang cập nhật...
                      </li>}
                </ul>
              </div>
              
              <div className="flex-grow min-h-0 mt-auto flex items-end">
                <div className="w-full bg-orange-100/50 rounded-xl p-2.5 flex items-center justify-center gap-2 hover:bg-[#ff751f] hover:text-white transition-colors group/btn text-[#ff751f] cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide truncate">Xem {commentCount} Bình luận</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
  );
}