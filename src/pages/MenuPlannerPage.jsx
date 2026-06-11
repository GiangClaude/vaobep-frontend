// VỊ TRÍ: frontend/src/pages/MenuPlannerPage.jsx

import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuProvider, useMenuState, MENU_ACTIONS } from '../context/MenuContext';
import { Trash2, GripVertical, Copy, User, ShoppingCart, Sparkles, Wand2, Plus, X } from 'lucide-react';
import { getRecipeImageUrl } from '../utils/imageHelper';
import { useAuth } from '../AuthContext';

// Import Modals
import RecipeSearchModal from '../component/menu/RecipeSearchModal';
import ShoppingListModal from '../component/menu/ShoppingListModal';
import AiConsultModal from '../component/menu/AiConsultModal';
import AiGeneratorModal from '../component/menu/AiGeneratorModal';

// Import Hooks Kiến trúc mới
import { useMenuDetailQuery } from '../hooks/queries/useMenuQueries';
import { useMenuPlannerUI } from '../hooks/ui/menu/useMenuPlannerUI';

const MenuPlannerBoard = () => {
    const { menuId } = useParams();
    const { currentUser } = useAuth();
    const { menuState, dispatch } = useMenuState();

    // 1. Fetch dữ liệu thực đơn tự động bằng Query
    const { data: fetchedMenu, isLoading } = useMenuDetailQuery(menuId);
    const hasInitialized = useRef(false);
    
    // 2. Cập nhật Context khi tải xong dữ liệu từ API
    useEffect(() => {
        if (fetchedMenu && !hasInitialized.current) {
            dispatch({ type: MENU_ACTIONS.INIT_MENU, payload: fetchedMenu });
            hasInitialized.current = true;
        }
    }, [fetchedMenu, dispatch]);

    // Kiểm tra quyền chủ sở hữu
    const isOwner = currentUser?.id === menuState?.user_id;

    // 3. Kéo toàn bộ State UI & Hàm xử lý từ Hook UI
    const {
        searchModalTarget, setSearchModalTarget,
        isShoppingListOpen, setIsShoppingListOpen,
        isAiModalOpen, setIsAiModalOpen,
        isAiGenModalOpen, setIsAiGenModalOpen,
        isSaving, isCloning,
        handleSave, handleClone,
        handleDragStart, handleDragEnd, handleDragOver, handleDrop
    } = useMenuPlannerUI(menuId, menuState, dispatch, currentUser, isOwner);

    // Tính tổng calo trong ngày (Giữ nguyên logic)
    const calculateDayCalo = (day) => {
        let total = 0;
        day.meals?.forEach(meal => {
            meal.recipes?.forEach(r => {
                total += (r.total_calo || 0) * (r.servings_multiplier || 1);
            });
        });
        return Math.round(total);
    };

    if (isLoading && !menuState.menu_id) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#ff6b35] font-semibold tracking-wide">Đang tải cấu trúc thực đơn...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC]">
            {/* CÁC MODAL GIỮ NGUYÊN */}
            <RecipeSearchModal 
                isOpen={!!searchModalTarget}
                onClose={() => setSearchModalTarget(null)}
                onSelectRecipe={(recipe) => {
                   const menuFormattedRecipe = {
                        recipe_id: recipe.id || recipe.recipe_id,
                        title: recipe.title,
                        cover_image: recipe.image || recipe.cover_image,
                        total_calo: recipe.calories || recipe.total_calo,
                        servings_multiplier: 1 
                    };

                    dispatch({
                        type: MENU_ACTIONS.ADD_RECIPE,
                        payload: { 
                            dayId: searchModalTarget.dayId, 
                            mealId: searchModalTarget.mealId, 
                            recipe: menuFormattedRecipe 
                        }
                    });
                    setSearchModalTarget(null);
                }}
            />
            <ShoppingListModal isOpen={isShoppingListOpen} onClose={() => setIsShoppingListOpen(false)} menuId={menuId} />
            <AiConsultModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} menuState={menuState} />
            <AiGeneratorModal isOpen={isAiGenModalOpen} onClose={() => setIsAiGenModalOpen(false)} />

            {/* HEADER ĐƯỢC TÂN TRANG */}
            <header className="bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] px-8 py-5 flex flex-wrap gap-4 justify-between items-center shrink-0 border-b border-gray-100 z-10 sticky top-0">
                <div className="flex flex-col gap-1.5 flex-1 min-w-[300px]">
                    <input 
                        type="text" 
                        value={menuState.name || ""} 
                        readOnly={!isOwner}
                        onChange={(e) => dispatch({ type: MENU_ACTIONS.UPDATE_META, payload: { name: e.target.value } })}
                        className={`text-3xl font-extrabold text-slate-800 bg-transparent border-none outline-none focus:ring-0 w-full p-0 transition-colors ${isOwner ? 'hover:text-[#ff6b35] focus:text-[#ff6b35]' : 'cursor-default'}`}
                        placeholder="Nhập tên thực đơn..."
                    />
                    {!isOwner && menuState.author_name && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <span className="bg-slate-100 p-1 rounded-full"><User className="w-3.5 h-3.5" /></span>
                            Đăng bởi: <span className="font-bold text-[#ff6b35]">{menuState.author_name}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {isOwner && (
                        <button onClick={() => setIsAiModalOpen(true)} className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> AI Tư Vấn
                        </button>
                    )}
                    {isOwner && (
                        <button onClick={() => setIsAiGenModalOpen(true)} className="group flex items-center gap-2 px-5 py-2.5 bg-orange-50 border-2 border-transparent hover:border-orange-200 text-[#ff6b35] font-bold rounded-2xl transition-all hover:bg-orange-100">
                            <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Auto Sinh Menu
                        </button>
                    )}
                    <button onClick={() => setIsShoppingListOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-[#ff6b35] hover:text-[#ff6b35] transition-all">
                        <ShoppingCart className="w-4 h-4" /> Đi Chợ
                    </button>

                    <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div> {/* Divider */}

                    {isOwner ? (
                        <>
                            <button onClick={() => dispatch({ type: MENU_ACTIONS.ADD_DAY })} className="flex items-center gap-1.5 px-5 py-2.5 bg-white border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-[#ff6b35] hover:text-[#ff6b35] hover:bg-orange-50/50 transition-all">
                                <Plus className="w-4 h-4" /> Thêm Ngày
                            </button>
                            <button onClick={handleSave} disabled={isSaving} className="px-7 py-2.5 bg-[#ff6b35] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#e85b28] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none">
                                {isSaving ? 'Đang lưu...' : 'Lưu Thực Đơn'}
                            </button>        
                        </>
                    ) : (
                        <button onClick={handleClone} disabled={isCloning} className="flex items-center gap-2 px-7 py-2.5 bg-[#ff6b35] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#e85b28] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none">
                            <Copy className="w-4 h-4" /> {isCloning ? 'Đang lưu...' : 'Nhân bản về máy'}
                        </button>
                    )}
                </div>
            </header>

            {/* KANBAN BOARD */}
            <main className="flex-1 overflow-x-auto p-8 scroll-smooth">
                <div className="flex gap-6 min-h-full items-start">
                    {menuState.days?.map((day) => (
                        <div key={day.day_id} className="w-[360px] shrink-0 bg-white/60 backdrop-blur-sm rounded-[32px] p-5 flex flex-col border border-slate-200/60 shadow-sm relative group hover:shadow-md hover:bg-white transition-all duration-300">
                            
                            {/* Nút xóa ngày - Cải thiện vị trí và animation */}
                            {isOwner && (
                                <button 
                                    onClick={() => { if(window.confirm('Bạn có chắc muốn xóa ngày này?')) dispatch({ type: MENU_ACTIONS.REMOVE_DAY, payload: { dayId: day.day_id }}) }} 
                                    className="absolute -top-3 -right-3 bg-white text-slate-400 hover:bg-red-500 hover:text-white p-2.5 rounded-full opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-md z-10 border border-slate-100 hover:border-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Header của Ngày */}
                            <div className="flex justify-between items-center mb-5 px-2">
                                <input 
                                    type="text" 
                                    value={day.title || ""} 
                                    readOnly 
                                    className="text-xl font-extrabold text-slate-800 bg-transparent border-none focus:ring-0 outline-none w-3/5 p-0 truncate" 
                                />
                                <div className="flex items-center gap-1.5 bg-orange-100/80 text-[#ff6b35] px-3 py-1.5 rounded-xl border border-orange-200/50">
                                    <span className="text-sm font-black">{calculateDayCalo(day)}</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">Kcal</span>
                                </div>
                            </div>
                            
                            {/* Danh sách Bữa ăn */}
                            <div className="flex flex-col gap-4">
                                {day.meals?.map((meal) => (
                                    <div 
                                        key={meal.meal_id} 
                                        className="bg-slate-50/80 rounded-[24px] border border-slate-100 overflow-hidden relative group/meal transition-colors hover:border-orange-200/60"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, day.day_id, meal.meal_id)}
                                    >
                                        {/* Header Bữa ăn */}
                                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100/80">
                                            <input
                                                type="text"
                                                value={meal.title || (meal.meal_type === 'breakfast' ? 'Sáng' : meal.meal_type === 'lunch' ? 'Trưa' : meal.meal_type === 'dinner' ? 'Tối' : 'Bữa phụ')}
                                                onChange={(e) => dispatch({ type: MENU_ACTIONS.UPDATE_MEAL, payload: { dayId: day.day_id, mealId: meal.meal_id, title: e.target.value }})}
                                                readOnly={!isOwner}
                                                className="text-[15px] font-bold text-slate-700 bg-transparent border-none outline-none focus:ring-2 focus:ring-[#ff6b35]/20 rounded-lg px-2 w-28 -ml-2 transition-all"
                                            />
                                            <div className="flex items-center gap-1">
                                                {isOwner && (
                                                    <button onClick={() => dispatch({ type: MENU_ACTIONS.REMOVE_MEAL, payload: { dayId: day.day_id, mealId: meal.meal_id }})} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover/meal:opacity-100 transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {isOwner && (
                                                    <button onClick={() => setSearchModalTarget({ dayId: day.day_id, mealId: meal.meal_id })} className="text-xs text-[#ff6b35] hover:text-white font-bold bg-orange-100 hover:bg-[#ff6b35] px-3 py-1.5 rounded-xl transition-all">
                                                        + Món
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Vùng chứa Món ăn */}
                                        <div className="p-3 flex flex-col gap-3 min-h-[80px]">
                                            {(!meal.recipes || meal.recipes.length === 0) ? (
                                                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-[16px] py-6 bg-white/50">
                                                    <span className="text-sm font-semibold text-slate-400">{isOwner ? 'Kéo thả món vào đây' : 'Chưa có món ăn'}</span>
                                                </div>
                                            ) : (
                                                meal.recipes?.map(recipe => (
                                                    <div 
                                                        key={recipe.recipe_id}
                                                        draggable={isOwner}
                                                        onDragStart={(e) => isOwner && handleDragStart(e, day.day_id, meal.meal_id, recipe.recipe_id)}
                                                        onDragEnd={isOwner ? handleDragEnd : undefined}
                                                        className="group bg-white border border-slate-100 p-3 rounded-[20px] flex flex-col gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(255,107,53,0.08)] hover:border-orange-200 transition-all cursor-grab active:cursor-grabbing"
                                                    >
                                                        <div className="flex items-center gap-3 w-full">
                                                            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing shrink-0" />
                                                            <img src={recipe.cover_image ? getRecipeImageUrl(recipe.recipe_id, recipe.cover_image) : '/assets/recipe_placeholder.png'} alt={recipe.title} className="w-12 h-12 object-cover rounded-xl shadow-sm shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-[15px] font-bold text-slate-800 truncate mb-0.5">{recipe.title}</h4>
                                                                <p className="text-xs text-slate-400 font-semibold">{Math.round((recipe.total_calo || 0) * (recipe.servings_multiplier || 1))} Kcal</p>
                                                            </div>
                                                            {isOwner && (
                                                                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: MENU_ACTIONS.REMOVE_RECIPE, payload: { dayId: day.day_id, mealId: meal.meal_id, recipeId: recipe.recipe_id }})}} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Control Khẩu phần */}
                                                        <div className="flex justify-between items-center bg-slate-50/80 p-2 rounded-[14px] border border-slate-100">
                                                            <span className="text-xs text-slate-500 font-semibold ml-2">Khẩu phần</span>
                                                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                                                {isOwner && (
                                                                    <button onClick={(e) => { e.stopPropagation(); dispatch({ type: MENU_ACTIONS.UPDATE_SERVINGS, payload: { dayId: day.day_id, mealId: meal.meal_id, recipeId: recipe.recipe_id, delta: -1 }})}} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-[#ff6b35] font-bold transition-colors">
                                                                        -
                                                                    </button>
                                                                )}
                                                                <span className="text-sm font-extrabold text-slate-800 w-6 text-center">{recipe.servings_multiplier || 1}</span>
                                                                {isOwner && (
                                                                    <button onClick={(e) => { e.stopPropagation(); dispatch({ type: MENU_ACTIONS.UPDATE_SERVINGS, payload: { dayId: day.day_id, mealId: meal.meal_id, recipeId: recipe.recipe_id, delta: 1 }})}} className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-[#ff6b35] font-bold transition-colors">
                                                                        +
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isOwner && (
                                    <button onClick={() => dispatch({ type: MENU_ACTIONS.ADD_MEAL, payload: { dayId: day.day_id }})} className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 font-bold rounded-[20px] hover:border-[#ff6b35] hover:text-[#ff6b35] hover:bg-orange-50/50 transition-all flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Bữa ăn
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {(!menuState.days || menuState.days.length === 0) && (
                        <div className="flex flex-col gap-4 items-center justify-center w-full max-w-lg mx-auto mt-20 p-10 bg-white/50 border-2 border-dashed border-slate-200 rounded-[32px]">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#ff6b35]">
                                <Plus className="w-8 h-8" />
                            </div>
                            <p className="text-slate-500 font-semibold text-lg">Chưa có ngày nào trong thực đơn</p>
                            {isOwner && (
                                <button onClick={() => dispatch({ type: MENU_ACTIONS.ADD_DAY })} className="px-6 py-2.5 bg-[#ff6b35] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#e85b28] transition-all">
                                    Thêm Ngày Mới Ngay
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Wrapper để xuất ra ngoài
const MenuPlannerWrapper = () => (
    <MenuProvider>
        <MenuPlannerBoard />
    </MenuProvider>
);

export default MenuPlannerWrapper;