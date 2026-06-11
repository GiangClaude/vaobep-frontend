import { Coins, TrendingUp, TrendingDown, Gift, Star, Calendar, Filter, CheckCircle } from "lucide-react"; 
import { motion } from "framer-motion";
import { useState } from "react";
import { useOutletContext } from "react-router-dom"; 

export function PointsTab() {
  const [filter, setFilter] = useState("all"); 

  // Chỉ lấy những gì cần thiết cho tab này (bỏ rewards, handleCheckIn đi)
  const { currentUser, pointsHistory, pointsLoading } = useOutletContext();

  const currentPoints = currentUser?.points || 0;
  const role = currentUser?.role || 'user';
  const history = pointsHistory || []; 
  const loading = pointsLoading;

  // (Mock các hàm chưa làm)
  const onGiftPoints = () => alert("Tính năng tặng điểm đang phát triển!");
  const onPromoteRecipe = () => alert("Tính năng quảng bá công thức đang phát triển!");

  const getRoleInfo = (role) => {
    const roles = {
      user: { name: "Thành viên", color: "text-gray-600", bg: "bg-gray-100" },
      vip: { name: "VIP", color: "text-yellow-600", bg: "bg-yellow-100" },
      pro: { name: "Chuyên gia", color: "text-purple-600", bg: "bg-purple-100" } 
    };
    return roles[role] || roles.user;
  };

  const roleInfo = getRoleInfo(role);

  const getTransactionInfo = (type) => {
    switch (type) {
      case "checkin": return { icon: <CheckCircle className="w-5 h-5 text-green-500" />, label: "Điểm danh", color: "text-green-600" };
      case "earn": return { icon: <TrendingUp className="w-5 h-5 text-blue-500" />, label: "Nhận điểm", color: "text-blue-600" };
      case "redeem": return { icon: <TrendingUp className="w-5 h-5 text-orange-500" />, label: "Đổi quà", color: "text-orange-600" };
      case "spend": return { icon: <TrendingDown className="w-5 h-5 text-orange-500" />, label: "Tiêu điểm", color: "text-orange-600" };
      case "gift_sent": return { icon: <Gift className="w-5 h-5 text-red-500" />, label: "Tặng quà", color: "text-red-600" };
      case "gift_received": return { icon: <Gift className="w-5 h-5 text-purple-500" />, label: "Nhận quà", color: "text-purple-600" };
      default: return { icon: <Coins className="w-5 h-5 text-gray-500" />, label: "Khác", color: "text-gray-600" };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Points Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl"><Coins className="w-6 h-6" /></div>
              <div>
                <p className="text-white/80 text-sm">Số điểm hiện tại</p>
                <h2 className="text-3xl font-bold">{currentPoints.toLocaleString()}</h2>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 ${roleInfo.bg} ${roleInfo.color} px-4 py-1.5 rounded-full text-sm font-semibold`}>
              <Star className="w-4 h-4" /> {roleInfo.name}
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center space-y-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGiftPoints} className="w-full bg-pink-50 text-pink-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-pink-100 transition-colors">
            <Gift className="w-5 h-5" /> Tặng điểm cho tác giả
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onPromoteRecipe} className="w-full bg-orange-50 text-[#ff6b35] py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-orange-100 transition-colors">
            <TrendingUp className="w-5 h-5" /> Quảng bá công thức
          </motion.button>
        </div>
      </div>

      {/* 2. Lịch sử điểm */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800"><Calendar className="w-5 h-5 text-[#ff6b35]" /> Lịch Sử Giao Dịch</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
             {/* ... (Phần render thead và tbody table giữ nguyên như code cũ của bạn) ... */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Thời gian</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Nội dung</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Loại</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">Thay đổi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Đang tải dữ liệu...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Chưa có lịch sử giao dịch</td></tr>
              ) : (
                history.map((item) => {
                  const transInfo = getTransactionInfo(item.type);
                  return (
                    <motion.tr key={item.transaction_id || item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-2 text-gray-800 font-medium">
                        {item.message}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5"><span className={transInfo.color}>{transInfo.label}</span></div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`font-bold ${item.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                          {item.amount > 0 ? "+" : ""}{item.amount.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}