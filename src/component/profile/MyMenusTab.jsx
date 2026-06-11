// frontend/src/component/profile/MyMenusTab.jsx
import { useState, useMemo } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

// Import Component MenuCard đã có
import MenuCard from '../menu/MenuCard';

// Import Hooks chuẩn của bạn
import { useMyMenusQuery } from '../../hooks/queries/useMenuQueries';
import { useMenuListUI } from '../../hooks/ui/menu/useMenuListUI';

export function MyMenusTab({ isPublicView = false }) {
  const [filter, setFilter] = useState('all');
  
  // 1. Lấy dữ liệu từ API thông qua React Query
  const { data: myMenus = [], isLoading } = useMyMenusQuery();
  
  // 2. Lấy hàm tạo thực đơn mới từ UI Hook
  const { handleCreateBlankMenu, isCreating } = useMenuListUI();

  // 3. Xử lý logic lọc (Tất cả / Công khai / Cá nhân)
  const displayMenus = useMemo(() => {
    let result = myMenus;
    if (filter === 'public') {
      result = result.filter(m => m.is_public === true || m.is_public === 1);
    } else if (filter === 'private') {
      result = result.filter(m => m.is_public === false || m.is_public === 0);
    }
    return result;
  }, [myMenus, filter]);

  return (
    <div className="relative">
      {/* Header: Bộ lọc và Nút Tạo */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        
        {/* Bộ lọc trạng thái */}
        <div className="flex gap-2">
          {!isPublicView && [
            { id: 'all', label: 'Tất cả' },
            { id: 'public', label: 'Công khai' },
            { id: 'private', label: 'Cá nhân' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === f.id 
                  ? "bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white shadow-md" 
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Nút Tạo Thực đơn */}
        {!isPublicView && (
          <div className="flex items-center gap-4 ml-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handleCreateBlankMenu}
              disabled={isCreating}
              className={`px-5 py-2 rounded-full flex items-center gap-2 shadow-md font-semibold text-sm transition-all text-white
                ${isCreating ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"}`
              }
            >
              <Plus className="w-4 h-4" /> 
              {isCreating ? "Đang tạo..." : "Tạo thực đơn"}
            </motion.button>
          </div>
        )}
      </div>

      {/* Body: Hiển thị danh sách */}
      {isLoading ? (
        <div className="py-20 text-center text-[#ff6b35] animate-pulse font-medium">
          Đang tải danh sách thực đơn của bạn...
        </div>
      ) : displayMenus.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="inline-flex bg-gradient-to-br from-[#ff6b35]/10 to-[#ffc857]/10 p-6 rounded-full mb-4">
            <CalendarDays className="w-12 h-12 text-[#ff6b35]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có thực đơn nào</h3>
          <p className="text-gray-500 text-sm">Hãy tạo kế hoạch ăn uống ngay hôm nay!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMenus.map((menu) => (
            <motion.div 
              layout 
              key={menu.menu_id} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
            >
              <MenuCard menu={menu} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}