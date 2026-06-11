// VỊ TRÍ: frontend/src/component/menu/AiConsultModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Bot } from 'lucide-react';
// Import Mutation AI
import { useAiConsultationMutation } from '../../hooks/mutations/useMenuMutations';

export default function AiConsultModal({ isOpen, onClose, menuState }) {
    const [aiResponse, setAiResponse] = useState('');
    const hasFetched = useRef(false);
    
    // 1. KẾT NỐI MUTATION
    const consultMutation = useAiConsultationMutation();
    const isThinking = consultMutation.isPending;

    useEffect(() => {
        if (!isOpen) {
            hasFetched.current = false;
            return;
        }

        const fetchAI = async () => {
            if (isOpen && menuState && !hasFetched.current) {
                hasFetched.current = true;
                setAiResponse('');
                
                // Kiểm tra xem menu có món ăn chưa
                const hasRecipes = menuState.days?.some(d => d.meals?.some(m => m.recipes?.length > 0));
                
                if (!hasRecipes) {
                    setAiResponse("Thực đơn của bạn đang trống. Hãy thêm một vài món ăn vào các ngày để tôi có thể tư vấn chi tiết nhé! 😊");
                    return;
                }

                try {
                    // Gọi API qua Mutation
                    const response = await consultMutation.mutateAsync(menuState);
                    if (response.success && response.data) {
                        setAiResponse(response.data);
                    } else {
                        setAiResponse("Xin lỗi, tôi đang bận xíu. Bạn thử lại sau nhé! 😅");
                    }
                } catch (error) {
                    setAiResponse("Lỗi kết nối máy chủ AI. Vui lòng thử lại!");
                }
            }
        };
        fetchAI();
    }, [isOpen, menuState, consultMutation]);

    // Hàm render Markdown cơ bản
    const formatText = (text) => {
        return text.split('\n').map((line, index) => {
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>');
            return <p key={index} className="mb-3 last:mb-0" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
        });
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-lg overflow-hidden border border-white/20 transform transition-all animate-in zoom-in-95 duration-200">
                {/* Header Gradient */}
                <div className="p-5 bg-gradient-to-r from-violet-50 to-fuchsia-50 flex justify-between items-center relative overflow-hidden border-b border-violet-100/50">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-200">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">AI Chuyên Gia Dinh Dưỡng</h2>
                            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Phân tích thực đơn</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-all relative z-10 shadow-sm border border-transparent hover:border-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-white min-h-[280px] max-h-[65vh] overflow-y-auto">
                    {isThinking ? (
                        <div className="flex flex-col items-center justify-center h-full text-violet-500 space-y-5 py-12">
                            <div className="relative">
                                <div className="w-14 h-14 border-4 border-violet-100 border-t-violet-500 rounded-full animate-spin"></div>
                                <Bot className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-300" />
                            </div>
                            <p className="font-bold tracking-wide animate-pulse">Đang phân tích vi chất & calo...</p>
                        </div>
                    ) : (
                        <div className="text-slate-600 leading-relaxed text-[15px] font-medium bg-slate-50/50 p-5 rounded-[24px] border border-slate-100/80">
                            {formatText(aiResponse)}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}