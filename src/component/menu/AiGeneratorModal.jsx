// VỊ TRÍ: frontend/src/component/menu/AiGeneratorModal.jsx

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Wand2, Sparkles } from 'lucide-react';
import { useMenuState, MENU_ACTIONS } from '../../context/MenuContext';
// Dùng Mutation mới tạo
import { useAutoGenerateMenuMutation } from '../../hooks/mutations/useMenuMutations';
import { useGlobalModal } from '../../context/ModalContext';
import { v4 as uuidv4 } from 'uuid';

export default function AiGeneratorModal({ isOpen, onClose }) {
    const { dispatch } = useMenuState();
    const [prompt, setPrompt] = useState('');
    const { showModal } = useGlobalModal();
    // 1. KẾT NỐI MUTATION
    const generateMutation = useAutoGenerateMenuMutation();
    const isThinking = generateMutation.isPending; 

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        try {
            const result = await generateMutation.mutateAsync(prompt);

            if (result.success && result.data) {
                let aiDays = Array.isArray(result.data) ? result.data : result.data.days;
                if (!aiDays) throw new Error("Dữ liệu AI không đúng định dạng mảng ngày");
                
                const normalizedDays = aiDays.map((day, dIdx) => ({
                    ...day,
                    day_id: uuidv4(),
                    title: day.title || `Ngày ${dIdx + 1}`,
                    meals: (day.meals || []).map(meal => ({
                        ...meal,
                        meal_id: uuidv4(),
                        title: meal.title || (meal.meal_type === 'breakfast' ? 'Sáng' : meal.meal_type === 'lunch' ? 'Trưa' : meal.meal_type === 'dinner' ? 'Tối' : 'Bữa phụ'),
                        recipes: (meal.recipes || meal.dishes || []).map(recipe => ({
                            ...recipe,
                            recipe_id: recipe.recipe_id || recipe.id || uuidv4(),
                            servings_multiplier: recipe.servings_multiplier || 1,
                            total_calo: recipe.total_calo || recipe.calories || 0,
                            cover_image: recipe.cover_image || recipe.image || ''
                        }))
                    }))
                }));
                // Đẩy vào Context Kanban
                dispatch({ type: MENU_ACTIONS.OVERRIDE_DAYS, payload: result.data });
                showModal({
                    type: 'success',
                    title: 'Tuyệt vời!',
                    message: "✨ AI đã lên xong thực đơn! Hãy kiểm tra bảng Kanban và bấm 'Lưu Thực Đơn' để lưu vào hệ thống nhé."
                });
                onClose();
            } else {
                showModal({ type: 'error', title: 'Lỗi sinh thực đơn', message: result.message || "Có lỗi xảy ra" });
            }
        } catch (error) {
            showModal({ type: 'error', title: 'Lỗi kết nối AI', message: error.message });
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-lg overflow-hidden border border-white/20 transform transition-all animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 flex justify-between items-center relative overflow-hidden border-b border-orange-100/50">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-orange-200/40 to-[#ff6b35]/20 rounded-full blur-2xl"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#ff6b35] to-amber-500 flex items-center justify-center shadow-md shadow-orange-200">
                            <Wand2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">AI Tạo Thực Đơn</h2>
                            <p className="text-xs font-semibold text-[#ff6b35] uppercase tracking-wider">Tự động hoá</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={isThinking} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-all relative z-10 shadow-sm border border-transparent hover:border-orange-100 disabled:opacity-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-white">
                    {isThinking ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-5">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-orange-100 border-t-[#ff6b35] rounded-full animate-spin"></div>
                                <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-300 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="font-extrabold text-slate-700 animate-pulse text-lg mb-1">
                                    Đang lục lọi kho công thức...
                                </p>
                                <p className="text-sm text-slate-400 font-medium bg-[#fff9f0] px-3 py-1 rounded-full inline-block">Vui lòng chờ khoảng 10-15 giây nhé 🍳</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-[#fff9f0] border border-orange-100 p-4 rounded-[20px] mb-5">
                                <p className="text-slate-600 text-[15px] font-medium leading-relaxed">
                                    Hãy miêu tả chi tiết mong muốn của bạn (số ngày, mục tiêu, sở thích ăn uống, nguyên liệu có sẵn...). AI sẽ tự động ráp nối thành một thực đơn hoàn chỉnh.
                                </p>
                                <p className="text-red-500 text-[15px] font-medium leading-relaxed">
                                    Lưu ý: AI sẽ tự động thay thế toàn bộ thực đơn, hãy chắc chắn bạn đồng ý cho phép sửa. 
                                </p>
                            </div>
                            <div className="relative">
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ví dụ: Lên cho tôi thực đơn 3 ngày ăn chay nhẹ nhàng, nhiều rau xanh, ít dầu mỡ..."
                                    className="w-full h-36 p-4 bg-white border-2 border-slate-200 rounded-[20px] focus:border-[#ff6b35] focus:ring-4 focus:ring-[#ff6b35]/10 outline-none resize-none transition-all text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                />
                                <div className="absolute bottom-3 right-4 text-xs font-semibold text-slate-400">
                                    {prompt.length} ký tự
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-[16px] transition-colors">
                                    Hủy
                                </button>
                                <button 
                                    onClick={handleGenerate} 
                                    disabled={!prompt.trim()}
                                    className="px-6 py-3 bg-[#ff6b35] text-white font-bold rounded-[16px] shadow-[0_8px_20px_-6px_rgba(255,107,53,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-6px_rgba(255,107,53,0.5)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                                >
                                    <Wand2 className="w-4 h-4" /> Bắt đầu tạo
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}