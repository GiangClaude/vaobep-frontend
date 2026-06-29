import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { ProfileHeader } from "../component/profile/ProfileHeader";
import { ProfileTabs } from "../component/profile/ProfileTabs";
import { ClaimRewardModal } from "../component/profile/rewards/ClaimRewardModal";
import { AccountSettingsModal } from "../component/profile/AccountSettingsModal"; 
import { ProfileSidebar } from "../component/profile/ProfileSidebar";

import { useAuth } from "../AuthContext";
import { usePointsHistoryQuery } from "../hooks/queries/useUserQueries";
import { useMyRewardsQuery } from "../hooks/queries/useMiscQueries";
import { useProfileUI } from "../hooks/ui/profile/useProfileUI"; 

export default function ProfileLayout() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { data: pointsData, isLoading: pointsLoading } = usePointsHistoryQuery(1, 'all');
  const pointsHistory = pointsData?.history || [];
  const { data: rewards = [] } = useMyRewardsQuery();

  const { 
    handleSaveProfile, isUpdatingProfile,
    passwords, setPasswords, errors, resetFields, isChangingPass, handleChangePassword, 
    isChangePassModalOpen, setIsChangePassModalOpen,
    handleCheckIn,
    selectedBox, receivedItems, isRewardModalOpen, setIsRewardModalOpen, isOpening, handleOpenReward
  } = useProfileUI();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/profile/articles" && currentUser?.role === "user") {
        navigate("/profile/recipes", { replace: true });
    }
  }, [location.pathname, currentUser, navigate]);

  if (!currentUser) return <div className="text-center p-10">Đang tải thông tin...</div>;
  return (
    <div className="min-h-screens">
      {isUpdatingProfile && <div className="fixed inset-0 bg-black/20 z-[70] cursor-wait"></div>}

      <main className="container mx-auto px-4 md:px-8 py-6 max-w-[1500px]">
        
        <ProfileHeader 
          user={currentUser} 
          isOwnProfile={true} 
          onEditProfile={() => setIsSettingsModalOpen(true)} 
        />
        
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
            
            <div className="w-full lg:w-[320px] flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                    <ProfileSidebar 
                        stats={currentUser.stats || { totalLikes: 0, totalViews: 0, totalComments: 0, totalFollowers: 0 }}
                        badges={[]}
                        pendingRewards={rewards}
                        onOpenReward={handleOpenReward}
                        onCheckIn={handleCheckIn}
                        isCheckedIn={currentUser.isCheckedIn}
                        role = {currentUser.role}
                    />
                </div>
            </div>

            <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                    <ProfileTabs userRole={currentUser.role} />
                </div>

                <div className="p-6">
                    <Outlet context={{
                        currentUser,
                        pointsHistory,
                        pointsLoading,
                        handleSaveProfile,
                        handleCheckIn,
                        handleChangePassword,
                        resetFields,
                        setIsChangePassModalOpen,
                        rewards,
                        handleOpenReward 
                    }} />
                </div>
            </div>

        </div>

      </main>
        <AccountSettingsModal 
         isOpen={isSettingsModalOpen} 
         onClose={() => setIsSettingsModalOpen(false)} 
         user={currentUser}
         onSaveProfile={handleSaveProfile}
         isUpdatingProfile={isUpdatingProfile}
         passwords={passwords}
         setPasswords={setPasswords}
         errors={errors}
         resetFields={resetFields}
         isChangingPass={isChangingPass}
         handleChangePassword={handleChangePassword}
      />
      <ClaimRewardModal isOpen={isRewardModalOpen} isOpening={isOpening} boxName={selectedBox?.box_name} items={receivedItems} onClose={() => setIsRewardModalOpen(false)} />
    </div>
  );
}