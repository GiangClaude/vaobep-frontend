import { Edit, UserPlus, UserMinus, Flag, Award, Gift } from "lucide-react";
import { motion } from "framer-motion"; // Lưu ý: framer-motion hoặc motion/react tùy thư viện bạn cài
import { getAvatarUrl } from '../../utils/imageHelper';

export function ProfileHeader({
  user,
  isOwnProfile,
  isFollowing,
  onEditProfile,
  onFollowToggle,
  onGift,
  onReport
}) {
  const getRoleBadge = (role) => {
    const badges = {
      user: { text: "Thành Viên", color: "bg-gray-600", textCol: "text-white" },
      vip: { text: "VIP", color: "bg-gradient-to-r from-[#ffc857] to-[#f7931e]", textCol: "text-white" },
      pro: { text: "Chuyên Gia", color: "bg-gradient-to-r from-purple-500 to-pink-500", textCol: "text-white" }
    };
    return badges[role] || badges.user;
  };

  const badge = getRoleBadge(user.role);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative mb-6">
      
      {/* 1. ẢNH BÌA (Cover Photo) */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ffc857] w-full relative">
         {/* Hiển thị ảnh bìa nếu có */}
            {user.coverImage && (
                <img 
                  src={user.coverImage} // Sử dụng hàm lấy url ảnh bìa
                  alt="Cover" 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  onError={(e) => e.target.style.display = 'none'} // Ẩn ảnh nếu lỗi, lộ ra gradient
                />
            )}
              {/* Lớp overlay làm tối ảnh một chút để nổi bật avatar */}
              <div className="absolute inset-0 bg-black/15 z-0"></div> 
      </div>

      {/* 2. NỘI DUNG HEADER */}
      <div className="px-6 pb-6 relative">
        
        {/* Hàng chứa Avatar và Nút Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 -mt-16 sm:-mt-12 mb-4">

          {/* Avatar đè lên bìa */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative z-10">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-md">
              <img
                src={getAvatarUrl(user.id, user.avatar)}
                alt={user.fullName}
                className="w-full h-full object-cover" 
              />
            </div>
          </motion.div>

          {/* Action Buttons (Nằm góc phải) */}
          <div className="flex flex-wrap gap-2 z-10 w-full sm:w-auto mt-2 sm:mt-0">
            {isOwnProfile ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEditProfile}
                className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-sm"
              >
                <Edit className="w-4 h-4" /> Chỉnh sửa
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onFollowToggle}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                    isFollowing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-[#ff6b35] text-white hover:bg-[#e85d2b] shadow-sm"
                  }`}
                >
                  {isFollowing ? <><UserMinus className="w-4 h-4" /> Đang theo dõi</> : <><UserPlus className="w-4 h-4" /> Theo dõi</>}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGift}
                  className="px-5 py-2.5 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 font-semibold flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <Gift className="w-4 h-4" /> Tặng điểm
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onReport}
                  className="px-3 py-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500 transition-all"
                  title="Báo cáo người dùng này"
                >
                  <Flag className="w-4 h-4" />
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Thông tin Text (Tên, Bio, Badge) */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 ${badge.color} ${badge.textCol}`}>
              <Award className="w-3.5 h-3.5" /> {badge.text}
            </span>
          </div>
          
          {user.bio ? (
            <p className="text-gray-600 text-sm max-w-2xl whitespace-pre-line leading-relaxed">{user.bio}</p>
          ) : (
            <p className="text-gray-400 text-sm italic">Chưa có tiểu sử.</p>
          )}
        </div>

      </div>
    </div>
  );
}