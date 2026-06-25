import { X, Upload, Save, Eye, FileText, Clock, Users, Flame,  Sparkles, Check, AlertTriangle} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IngredientInput } from "./IngredientInput";
import { StepInput } from "./StepInput";
import ImageWithFallBack from "../figma/ImageWithFallBack";
import TagSelector from "../common/TagSelector";

// UI Hook
import { useRecipeFormUI } from "../../hooks/ui/recipe/useRecipeFormUI";

export function CreateRecipeModal({ isOpen, onClose, initialData = null }) {
    const {
        formData, setFormData,
        handleCoverImageUpload, handleRemoveCoverImage, handleSubmit,
        isSaving,
        aiResult, isAiLoading, handleCallAI, handleApplyAI, handleCancelAI
    } = useRecipeFormUI(initialData, isOpen, onClose);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#fff9f0] rounded-3xl shadow-2xl w-full max-w-5xl my-8" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white p-6 rounded-t-3xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6" />
                            <h2 className="text-xl font-bold">{formData.id ? "Chỉnh Sửa Công Thức" : "Đăng Công Thức Mới"}</h2>
                        </div>
                        <button onClick={onClose} className="bg-white/20 p-2 rounded-xl hover:bg-white/30"><X className="w-6 h-6" /></button>
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                        {/* Ảnh Bìa */}
                        <div>
                            <label className="block text-lg mb-3 font-bold text-gray-800 flex items-center gap-2"><Upload className="w-5 h-5 text-[#ff6b35]" /> Ảnh đại diện</label>
                            {formData.coverImage ? (
                                <div className="relative group w-1/2 aspect-video rounded-2xl overflow-hidden border-2 border-[#ffc857]/30">
                                    <ImageWithFallBack src={formData.coverImage} className="w-full h-full object-cover" />
                                    <button onClick={handleRemoveCoverImage} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <label className="w-1/2 aspect-video border-2 border-dashed border-[#ff6b35] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/50">
                                    <input type="file" accept="image/*" onChange={(e) => handleCoverImageUpload(e.target.files[0])} className="hidden" />
                                    <Upload className="w-8 h-8 text-[#ff6b35] mb-2" />
                                    <span className="text-gray-600 font-medium">Click để tải ảnh lên</span>
                                </label>
                            )}
                        </div>

                        {/* Text Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm mb-2 text-gray-700">Tên công thức *</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm mb-2 text-gray-700">Mô tả ngắn</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none resize-none" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2 text-gray-700"><Users className="w-4 h-4 text-[#ff6b35]" /> Khẩu phần</label>
                                <input type="number" min="1" value={formData.servings} onChange={(e) => setFormData({ ...formData, servings: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2 text-gray-700"><Clock className="w-4 h-4 text-[#ff6b35]" /> Thời gian (phút)</label>
                                <input type="number" min="1" value={formData.cookTime} onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2 text-gray-700"><Flame className="w-4 h-4 text-[#ff6b35]" /> Tổng calo</label>
                                <input type="number" min="0" value={formData.totalCalo} onChange={(e) => setFormData({ ...formData, totalCalo: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none" />
                            </div>
                        </div>

                        {/* Tags, Ings, Steps */}


                        <div>
                            <label className="block text-lg mb-3 font-bold text-gray-800">🏷️ Thẻ (Tags)</label>
                            <TagSelector selectedTags={formData.tags} onChange={(newTags) => setFormData({...formData, tags: newTags})} />
                        </div>

                                                {/* [BẮT ĐẦU THÊM MỚI 6] KHU VỰC AI ASSISTANT */}
                        <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-100 rounded-2xl p-4 mt-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" /> Trợ lý AI Phân Tích
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Tự động gợi ý Tags và tính toán lượng Calo dựa trên Nguyên liệu & Cách làm.</p>
                                </div>
                                <button 
                                    onClick={handleCallAI}
                                    disabled={isAiLoading || !formData.title || formData.ingredients.length === 0}
                                    className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm whitespace-nowrap"
                                >
                                    {isAiLoading ? (
                                        <span className="animate-pulse">AI đang suy nghĩ...</span>
                                    ) : (
                                        <>Phân tích ngay <Sparkles className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>

                            {/* Card Hiển thị kết quả AI */}
                            <AnimatePresence>
                                {aiResult && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }} 
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-white rounded-xl p-5 border border-purple-200 shadow-sm relative">
                                            <button onClick={handleCancelAI} className="absolute top-3 right-3 text-gray-400 hover:text-red-500"><X className="w-5 h-5"/></button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Cột trái: Tags & Lý do */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-2">🏷️ Tags Đề Xuất</h4>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {aiResult.suggested_tags.map((tag, idx) => (
                                                            <span key={idx} className="bg-orange-100 text-[#ff6b35] px-3 py-1 rounded-full text-sm font-medium border border-orange-200">{tag}</span>
                                                        ))}
                                                    </div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">💡 Cơ sở phân tích</h4>
                                                    <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">{aiResult.reasoning}</p>
                                                </div>

                                                {/* Cột phải: Calo */}
                                                <div>
                                                    <div className="flex items-end gap-2 mb-3">
                                                        <h4 className="font-semibold text-gray-800">🔥 Tổng Calo ước lượng:</h4>
                                                        <span className="text-xl font-bold text-red-500 leading-none">{aiResult.total_calories}</span>
                                                    </div>
                                                    
                                                    <ul className="text-sm text-gray-600 space-y-1.5 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        {aiResult.calorie_breakdown?.map((item, idx) => (
                                                            <li key={idx} className="flex justify-between border-b border-gray-200 last:border-0 pb-1 last:pb-0">
                                                                <span>{item.item}</span>
                                                                <span className="font-medium">{item.calories} kcal</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    
                                                    <p className="text-[11px] text-gray-400 flex items-start gap-1"><AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5"/> {aiResult.disclaimer}</p>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex justify-end gap-3 border-t border-gray-100 pt-4">
                                                <button onClick={handleCancelAI} className="px-4 py-2 rounded-lg text-gray-500 font-medium hover:bg-gray-100">Bỏ qua</button>
                                                <button onClick={handleApplyAI} className="px-4 py-2 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white font-medium rounded-lg flex items-center gap-2 hover:shadow-md">
                                                    <Check className="w-4 h-4"/> Áp dụng vào Form
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div>
                            <label className="block text-lg mb-3 font-bold text-gray-800">🥘 Nguyên liệu *</label>
                            <IngredientInput ingredients={formData.ingredients} onChange={(ingredients) => setFormData({ ...formData, ingredients })} />
                        </div>
                        <div>
                            <label className="block text-lg mb-3 font-bold text-gray-800">📝 Các bước thực hiện *</label>
                            <StepInput steps={formData.steps} onChange={(steps) => setFormData({ ...formData, steps })} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-white border-t-2 border-gray-200 rounded-b-3xl flex gap-3">
                        <button onClick={onClose} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium">Hủy</button>
                        <button onClick={() => handleSubmit("draft")} disabled={isSaving || !formData.title} className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50">
                            <Save className="w-5 h-5" /> Lưu nháp
                        </button>
                        <button onClick={() => handleSubmit("public")} disabled={isSaving || !formData.title || formData.ingredients.length === 0 || formData.steps.length === 0} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50">
                            <Eye className="w-5 h-5" /> Đăng công khai
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}