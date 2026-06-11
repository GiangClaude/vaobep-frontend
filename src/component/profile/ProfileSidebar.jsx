import { Trophy, TrendingUp, Users, Heart, BookOpen, CalendarCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarReward } from "./SidebarReward";

export function ProfileSidebar({ stats, badges = [], pendingRewards = [], onOpenReward, onCheckIn, isCheckedIn, isOwnProfile = true, role = 'user' }) {
  
  const pendingCount = pendingRewards?.filter(r => r.status === 'pending').length || 0;

  // Render 1 ô thống kê nhỏ
  const StatBox = ({ label, value, icon: Icon, colorClass }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-3 text-gray-600">
            <div className={`p-2 rounded-lg bg-white shadow-sm ${colorClass}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="font-bold text-gray-900">{value.toLocaleString()}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      
      {/* 1. HỘP QUÀ TẶNG (Chỉ hiện nếu có quà) */}
      <SidebarReward 
        pendingCount={pendingCount} 
        onClick={() => onOpenReward(pendingRewards.filter(r => r.status === 'pending')[0])} 
      />

      {isOwnProfile && 
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
              <CalendarCheck className="w-5 h-5 text-[#ff6b35]" />
              <h3 className="font-bold text-gray-800">Điểm danh</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Nhận +10 điểm mỗi ngày để thăng hạng và đổi quà.</p>
          <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={onCheckIn} 
              disabled={isCheckedIn} 
              className={`w-full py-2.5 rounded-xl font-bold transition-all text-sm ${
                  isCheckedIn 
                  ? "bg-green-50 text-green-600 cursor-not-allowed border border-green-200" 
                  : "bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isCheckedIn ? "Đã nhận điểm hôm nay" : "Điểm danh ngay"}
            </motion.button>
        </div>
      }


      {/* 3. THỐNG KÊ (Di chuyển từ Header cũ xuống đây) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#ff6b35]" />
          Thống Kê
        </h3>
        <div className="space-y-2">
          <StatBox label="Công thức đã đăng" value={stats.recipes || 0} icon={BookOpen} colorClass="text-blue-500" />
          { role !== 'user' && (
            <StatBox label="Bài viết đã đăng" value={stats.articles || 0} icon={FileText} colorClass="text-purple-500" />
          )}
          <StatBox label="Người đang theo dõi" value={stats.following || 0} icon={Users} colorClass="text-purple-500" />
          <StatBox label="Người theo dõi" value={stats.followers || 0} icon={Users} colorClass="text-purple-500" />
          { isOwnProfile && (
            <StatBox label="Bài đã lưu" value={stats.saved || 0} icon={Trophy} colorClass="text-yellow-500" />
          )}

          
        </div>
      </div>

      {/* 4. HUY CHƯƠNG (Giữ nguyên cấu trúc cũ, làm CSS nhẹ nhàng hơn) */}
      {badges && badges.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffc857]" />
            Huy Chương
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {badges.map((badge) => (
              <div key={badge.id} className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center p-2 border border-gray-100" title={badge.name}>
                <div className="text-3xl mb-1">{badge.icon}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}