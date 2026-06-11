// Mở file: src/component/profile/ProfileTabs.jsx
import { FileText, Heart, User, Coins, Settings, CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";

// Khai báo thêm thuộc tính 'path' và 'requirePro'
const allTabs = [
  { id: "recipes", label: "Công Thức Của Tôi", icon: FileText, path: "/profile/recipes" },
  { id: "articles", label: "Bài Viết", icon: FileText, path: "/profile/articles", requirePro: true },
  { id: "menus", label: "Thực Đơn", icon: CalendarDays, path: "/profile/menus" },
  { id: "saved", label: "Đã Lưu", icon: Heart, path: "/profile/saved" },
  { id: "info", label: "Thông Tin", icon: User, path: "/profile/info" },
  { id: "points", label: "Quản Lý Điểm", icon: Coins, path: "/profile/points" },
  { id: "settings", label: "Cài Đặt", icon: Settings, path: "/profile/settings" }
];

export function ProfileTabs({ userRole }) {
  const location = useLocation();

  // Lọc tab: Nếu là 'user' bình thường thì bỏ tab Articles đi
  const displayTabs = allTabs.filter(tab => {
    if (tab.requirePro && userRole === 'user') return false;
    return true;
  });

  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {displayTabs.map((tab) => {
            const Icon = tab.icon;
            // Kiểm tra xem URL hiện tại có chứa path của tab này không
            const isActive = location.pathname.includes(tab.path);

            return (
              <Link
                key={tab.id}
                to={tab.path}
                className="relative flex-shrink-0"
              >
                <div
                  className={`flex items-center gap-2 px-6 py-4 transition-all ${
                    isActive
                      ? "text-[#ff6b35]"
                      : "text-gray-600 hover:text-[#ff6b35]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium whitespace-nowrap">{tab.label}</span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeProfileTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6b35] to-[#ffc857] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}