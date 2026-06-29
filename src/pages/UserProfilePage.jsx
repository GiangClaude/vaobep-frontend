import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, UtensilsCrossed, CalendarDays, FileText } from "lucide-react";

import { ProfileHeader } from "../component/profile/ProfileHeader";
import { ProfileSidebar } from "../component/profile/ProfileSidebar"; 
import { MyRecipesTab } from "../component/profile/MyRecipeTab";
import { GiftPointsModal } from "../component/profile/GiftPointsModal";
import MenuCard from '../component/menu/MenuCard';
import { MyArticlesTab } from "../component/profile/MyArticlesTab";


import { useAuth } from "../AuthContext";
import { useUserProfileQuery } from "../hooks/queries/useUserQueries";
import { useUserProfileUI } from "../hooks/ui/profile/useUserProfileUI";

export default function UserProfilePage() {
  const { id } = useParams(); 
  const { currentUser } = useAuth(); 

  const [activeTab, setActiveTab] = useState('recipes');

  const { data, isLoading, error } = useUserProfileQuery(id);
  
  const { 
      isGiftModalOpen, setIsGiftModalOpen, 
      handleFollowClick, handleGiftSubmit 
  } = useUserProfileUI(id, currentUser);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy người dùng</h2>
        <p className="text-gray-600">{error?.message || "Tài khoản này có thể đã bị khóa hoặc không tồn tại."}</p>
        <a href="/" className="px-6 py-2 bg-[#ff6b35] text-white rounded-full hover:bg-[#e65a2a] transition-colors">
          Về trang chủ
        </a>
      </div>
    );
  }

  const { user, recipes, menus, articles } = data;
  console.log("User Profile: ", user);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <main className="w-full mx-auto px-4 md:px-8 py-6 max-w-[1500px]">
        
        <ProfileHeader
          user={user}
          isOwnProfile={false} 
          isFollowing={user.isFollowing}
          onFollowToggle={handleFollowClick}
          onGift={() => setIsGiftModalOpen(true)}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          
          <div className="w-full lg:w-[320px] flex-shrink-0">
             <div className="sticky top-24">
                <ProfileSidebar 
                   isOwnProfile={false} 
                   stats={user.stats || { totalLikes: 0, totalViews: 0, totalComments: 0, totalFollowers: 0 }}
                   badges={user.badges || []}
                   role={user.role}
                />
             </div>
          </div>

          <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             
             <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-2 flex overflow-x-auto scrollbar-hide">
                <button 
                  onClick={() => setActiveTab('recipes')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === 'recipes' ? 'text-[#ff6b35] border-b-2 border-[#ff6b35]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                   <UtensilsCrossed className="w-5 h-5" /> Công thức
                </button>
                {user.role !== 'user' && <button 
                  onClick={() => setActiveTab('articles')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === 'articles' ? 'text-[#ff6b35] border-b-2 border-[#ff6b35]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                   <FileText className="w-5 h-5" /> Bài viết
                </button>}
                <button 
                  onClick={() => setActiveTab('menus')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === 'menus' ? 'text-[#ff6b35] border-b-2 border-[#ff6b35]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                   <CalendarDays className="w-5 h-5" /> Thực đơn
                </button>
             </div>

             <div className="p-6">
                
                {activeTab === 'recipes' && (
                   <div>
                       <MyRecipesTab isPublicView={true} publicRecipes={recipes} />
                   </div>
                )}

                {activeTab === 'articles' && (
                  <div>

                          <MyArticlesTab isPublicView={true} publicArticles={articles} />
                  </div>
                )}

                {activeTab === 'menus' && (
                   <div>
                       {menus.length === 0 ? (
                            <div className="text-center py-16">
                                <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl text-gray-800 mb-2 font-bold">Chưa có thực đơn công khai</h3>
                                <p className="text-gray-500 text-sm">Người dùng này chưa chia sẻ thực đơn nào.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {menus.map(menu => (
                                    <MenuCard key={menu.menu_id} menu={menu} />
                                ))}
                            </div>
                        )}
                   </div>
                )}

             </div>
          </div>

        </div>
      </main>

      <GiftPointsModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        recipient={user}
        onSend={handleGiftSubmit}
        maxPoints={currentUser?.points || 0} 
      />
    </div>
  );
}