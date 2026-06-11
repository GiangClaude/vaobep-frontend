// VỊ TRÍ: frontend/src/component/menu/RecipeSearchModal.jsx

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Clock, Flame, Plus } from 'lucide-react';
import Pagination from '../common/Pagination'; 
import { getRecipeImageUrl } from '../../utils/imageHelper';

// Import trực tiếp các queries
import { 
    useRecipesListQuery, 
    useSavedRecipesQuery, 
    useOwnerRecipesQuery 
} from '../../hooks/queries/useRecipesQueries';

export default function RecipeSearchModal({ isOpen, onClose, onSelectRecipe }) {
    const [activeTab, setActiveTab] = useState('explore'); 
    
    const [searchInput, setSearchInput] = useState(''); 
    const [keyword, setKeyword] = useState(''); 
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    // 1. SỬ DỤNG REACT QUERY HOOKS
    const { data: exploreData, isFetching: loadingExplore } = useRecipesListQuery({ page, limit: 6, keyword });
    const { data: savedData, isFetching: loadingSaved } = useSavedRecipesQuery({ page, limit: 6 });
    const { data: mineData, isFetching: loadingMine } = useOwnerRecipesQuery();

    // 2. GÁN DỮ LIỆU ĐỘNG THEO TAB
    let recipes = [];
    let pagination = null;
    let isLoading = false;
    
    if (activeTab === 'explore') {
        recipes = exploreData?.data || [];
        pagination = exploreData?.meta || null;
        isLoading = loadingExplore;
    } else if (activeTab === 'saved') {
        recipes = savedData || [];
        isLoading = loadingSaved;
    } else if (activeTab === 'mine') {
        recipes = mineData || [];
        isLoading = loadingMine;
    }

    const handleSearch = () => {
        setKeyword(searchInput);
        setPage(1); 
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'explore', label: 'Khám phá' },
        { id: 'saved', label: 'Món đã lưu' },
        { id: 'mine', label: 'Của tôi' }
    ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-white/20 transform transition-all animate-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="p-5 px-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Thêm món ăn</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Chọn công thức để thêm vào lịch trình của bạn</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-slate-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Phân vùng Tabs & Search (Nằm trên nền xám nhẹ) */}
                <div className="bg-slate-50 border-b border-slate-100 shrink-0">
                    {/* Tabs Pill Style */}
                    <div className="flex px-6 pt-4 pb-2 gap-2 overflow-x-auto hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 font-bold rounded-full transition-all text-sm whitespace-nowrap ${
                                    activeTab === tab.id 
                                    ? 'bg-[#ff6b35] text-white shadow-md shadow-orange-200' 
                                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Thanh tìm kiếm */}
                    {activeTab === 'explore' && (
                        <div className="p-4 px-6 relative">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="Bạn muốn ăn món gì hôm nay? (VD: Gà nướng, Salad...)"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full bg-white border border-slate-200 rounded-[20px] py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-[#ff6b35]/10 focus:border-[#ff6b35] outline-none transition-all text-slate-700 font-medium placeholder:font-normal placeholder:text-slate-400 shadow-sm"
                                />
                                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#ff6b35] transition-colors" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Danh sách kết quả */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 scroll-smooth">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#ff6b35]"></div>
                            <p className="text-slate-400 font-semibold animate-pulse">Đang tìm món ngon...</p>
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">Không tìm thấy món ăn</h3>
                            <p className="text-slate-500">Hãy thử tìm với từ khóa khác hoặc chuyển tab nhé.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recipes.map(recipe => (
                                <div key={recipe.recipe_id} className="group bg-white p-3 rounded-[24px] border border-slate-100 flex gap-4 items-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-orange-200 transition-all duration-300">
                                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-[16px]">
                                        <img 
                                            src={recipe.image} 
                                            alt={recipe.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="font-extrabold text-slate-800 text-[15px] line-clamp-2 mb-2 leading-snug group-hover:text-[#ff6b35] transition-colors">{recipe.title}</h4>
                                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-3">
                                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                <Flame className="w-3.5 h-3.5 text-orange-500" />
                                                <span>{recipe.calories || 0} kcal</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                <span>{recipe.cookTime || 0}p</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onSelectRecipe(recipe)}
                                            className="flex items-center gap-1 text-xs font-bold text-[#ff6b35] bg-orange-50 hover:bg-[#ff6b35] hover:text-white px-4 py-2 rounded-xl w-fit transition-all"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Thêm món
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Phân trang */}
                    {pagination && recipes.length > 0 && (
                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <Pagination pagination={pagination} onPageChange={(newPage) => setPage(newPage)} />
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}