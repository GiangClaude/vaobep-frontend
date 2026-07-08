import { X, AlertCircle, Plus, Loader2 } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion"; 

import { MAX_INGREDIENTS, useIngredientInputUI } from "../../hooks/ui/recipe/useIngredientInputUI";

export function IngredientInput({ ingredients, onChange }) {
  const {
      isLoading,
      dbUnits,
      searchTerm, setSearchTerm,
      showDropdown, setShowDropdown,
      dropdownRef,
      currentIngredient, setCurrentIngredient,
      filteredIngredients,
      handleSelectIngredient,
      handleAddIngredient,
      handleRemoveIngredient
  } = useIngredientInputUI(ingredients, onChange);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const hasSelectedDuplicate = ingredients.some(
    (ing) => (ing.name || "").trim().toLowerCase() === normalizedSearchTerm
  );

  return (
    <div>
      {ingredients.length > 0 && (
        <div className="mb-4 space-y-2">
          <AnimatePresence>
            {ingredients.map((ing, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-xl border border-[#ffc857]/30"
              >
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-medium text-gray-800">{ing.name}</span>
                  {(ing.isNew || ing.status === 'pending') && (
                    <div className="relative group">
                      <AlertCircle className="w-4 h-4 text-[#ff6b35] cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        Nguyên liệu mới
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-[#ff6b35]">{ing.amount} {ing.unit}</span>
                </div>
                <button
                  type="button" 
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="bg-white rounded-xl border-2 border-[#ffc857]/30 p-4">
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <span>Đã thêm: {ingredients.length}/{MAX_INGREDIENTS}</span>
          {ingredients.length >= MAX_INGREDIENTS && <span className="text-[#ff6b35] font-semibold">Đã đạt giới hạn</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative" ref={dropdownRef}>
            <label className="block text-sm mb-1.5 text-gray-700">
              Nguyên liệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setCurrentIngredient({ ...currentIngredient, name: e.target.value, isNew: false });
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={isLoading}
              placeholder={isLoading ? "Đang tải dữ liệu..." : "Tìm hoặc thêm nguyên liệu..."}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] focus:outline-none transition-all"
            />
            
            {isLoading && (
                 <div className="absolute right-3 top-[38px]">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                 </div>
            )}

            {normalizedSearchTerm && hasSelectedDuplicate && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Nguyên liệu này đã được thêm trước đó. Hãy chọn lại từ danh sách hoặc xóa mục cũ nếu muốn thay đổi.</span>
              </div>
            )}

            <AnimatePresence>
              {showDropdown && searchTerm && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border-2 border-[#ffc857]/30 max-h-64 overflow-y-auto z-50"
                >
                  {filteredIngredients.length > 0 ? (
                    <div className="py-2">
                      {filteredIngredients.map((ing) => (
                        <button
                          key={ing.ingredient_id}
                          type="button"
                          onClick={() => handleSelectIngredient(ing, false)}
                          className="w-full px-4 py-2.5 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all flex items-center justify-between group"
                        >
                          <span className="text-gray-800 group-hover:text-[#ff6b35]">{ing.name}</span>
                          {ing.status === 'pending' && <span className="text-xs text-orange-500 italic">Chờ duyệt</span>}
                        </button>
                      ))}
                    </div>
                  ) : !hasSelectedDuplicate ? (
                    <button
                      type="button"
                      onClick={() => handleSelectIngredient({ ingredient_id: `new-${Date.now()}`, name: searchTerm }, true)}
                      className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#ff6b35]" />
                        <span className="text-gray-800">Tạo mới: <span className="font-semibold text-[#ff6b35]">"{searchTerm}"</span></span>
                      </div>
                    </button>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm mb-1.5 text-gray-700">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <input
              type="number" step="0.1"
              value={currentIngredient.amount}
              onChange={(e) => setCurrentIngredient({ ...currentIngredient, amount: e.target.value })}
              placeholder="100"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] focus:outline-none transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm mb-1.5 text-gray-700">
              Đơn vị <span className="text-red-500">*</span>
            </label>
            <select
              value={currentIngredient.unit}
              onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] focus:outline-none transition-all appearance-none bg-white cursor-pointer"
              disabled={isLoading}
            >
              <option value="">{isLoading ? "Đang tải..." : "Chọn đơn vị"}</option>
              {dbUnits.map((unit) => (
                <option key={unit.unit_id} value={unit.name}>{unit.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleAddIngredient}
              disabled={ingredients.length >= MAX_INGREDIENTS || !currentIngredient.name || !currentIngredient.amount || !currentIngredient.unit}
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white p-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}