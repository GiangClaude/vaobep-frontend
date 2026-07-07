import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuProvider, useMenuState, MENU_ACTIONS } from '../context/MenuContext';
import { Trash2, GripVertical, Copy, User, ShoppingCart, Sparkles, Wand2, Plus, X, CalendarDays, Flame } from 'lucide-react';
import { getRecipeImageUrl } from '../utils/imageHelper';
import { useAuth } from '../AuthContext';
import { useGlobalModal } from '../context/ModalContext';

import RecipeSearchModal from '../component/menu/RecipeSearchModal';
import ShoppingListModal from '../component/menu/ShoppingListModal';
import AiConsultModal from '../component/menu/AiConsultModal';
import AiGeneratorModal from '../component/menu/AiGeneratorModal';

import { useMenuDetailQuery } from '../hooks/queries/useMenuQueries';
import { useMenuPlannerUI } from '../hooks/ui/menu/useMenuPlannerUI';

const MenuPlannerBoard = () => {
    const { menuId } = useParams();
    const { currentUser } = useAuth();
    const { menuState, dispatch } = useMenuState();
    const { showModal } = useGlobalModal();

    const { data: fetchedMenu, isLoading } = useMenuDetailQuery(menuId);
    const hasInitialized = useRef(false);
    
    useEffect(() => {
        if (fetchedMenu && !hasInitialized.current) {
            dispatch({ type: MENU_ACTIONS.INIT_MENU, payload: fetchedMenu });
            hasInitialized.current = true;
        }
    }, [fetchedMenu, dispatch]);

    const isOwner = currentUser?.id === menuState?.user_id;

    const {
        searchModalTarget, setSearchModalTarget,
        isShoppingListOpen, setIsShoppingListOpen,
        isAiModalOpen, setIsAiModalOpen,
        isAiGenModalOpen, setIsAiGenModalOpen,
        isSaving, isCloning,
        handleSave, handleClone,
        handleDragStart, handleDragEnd, handleDragOver, handleDrop
    } = useMenuPlannerUI(menuId, menuState, dispatch, currentUser, isOwner);

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
            <div className="flex h-screen w-full items-center justify-center bg-[#fff9f0]">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-[#ff751f] rounded-full animate-spin shadow-lg"></div>
                    <span className="text-[#ff751f] font-bold tracking-wide text-lg">Đang chuẩn bị nhà bếp... 🍳</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#fff9f0]">
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

            <header className="bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(255,117,31,0.3)] px-8 py-5 flex flex-wrap gap-4 justify-between items-center shrink-0 border-b-2 border-orange-100 z-10 sticky top-0">
                <div className="flex flex-col gap-1.5 flex-1 min-w-[300px]">
                    <input 
                        type="text" 
                        value={menuState.name || ""} 
                        readOnly={!isOwner}
                        onChange={(e) => dispatch({ type: MENU_ACTIONS.UPDATE_META, payload: { name: e.target.value } })}
                        className={`text-3xl font-extrabold text-gray-800 bg-transparent border-none outline-none focus:ring-0 w-full p-0 transition-colors ${isOwner ? 'hover:text-[#ff751f] focus:text-[#ff751f] placeholder:text-gray-300' : 'cursor-default'}`}
                        placeholder="Nhập tên thực đơn... 😋"
                    />
                    {!isOwner && menuState.author_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <span className="bg-orange-50 p-1.5 rounded-full"><User className="w-3.5 h-3.5 text-[#ff751f]" /></span>
                            Đăng bởi: <span className="font-extrabold text-[#ff751f]">{menuState.author_name}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {isOwner && (
                        <button onClick={() => setIsAiModalOpen(true)} className="group flex items-center gap-2 px-5 py-2.5 bg-[#ff751f] text-white font-bold rounded-full shadow-md shadow-orange-300/50 hover:shadow-lg hover:shadow-orange-400/50 hover:-translate-y-0.5 transition-all">
                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> AI Tư Vấn
                        </button>
                    )}
                    {isOwner && (
                        <button onClick={() => setIsAiGenModalOpen(true)} className="group flex items-center gap-2 px-5 py-2.5 bg-orange-50 border-2 border-orange-100 hover:border-orange-200 text-[#ff751f] font-bold rounded-full transition-all hover:bg-orange-100">
                            <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Auto Sinh Menu
                        </button>
                    )}
                    <button onClick={() => setIsShoppingListOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-orange-100 text-gray-600 font-bold rounded-full hover:border-[#ff751f] hover:text-[#ff751f] hover:bg-orange-50 transition-all">
                        <ShoppingCart className="w-4 h-4" /> Đi Chợ
                    </button>

                    <div className="w-px h-8 bg-orange-100 mx-1 hidden sm:block"></div>

                    {isOwner ? (
                        <>
                            <button onClick={() => dispatch({ type: MENU_ACTIONS.ADD_DAY })} className="flex items-center gap-1.5 px-5 py-2.5 bg-white border-2 border-dashed border-orange-200 text-gray-600 font-bold rounded-full hover:border-[#ff751f] hover:text-[#ff751f] hover:bg-orange-50 transition-all">
                                <Plus className="w-4 h-4" /> Thêm Ngày
                            </button>
                            <button onClick={handleSave} disabled={isSaving} className="px-7 py-2.5 bg-[#ff751f] text-white font-bold rounded-full shadow-[0_4px_15px_rgba(255,117,31,0.3)] hover:bg-[#e86315] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none">
                                {isSaving ? 'Đang lưu...' : 'Lưu Thực Đơn'}
                            </button>        
                        </>
                    ) : (
                        <button onClick={handleClone} disabled={isCloning} className="flex items-center gap-2 px-7 py-2.5 bg-[#ff751f] text-white font-bold rounded-full shadow-[0_4px_15px_rgba(255,117,31,0.3)] hover:bg-[#e86315] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none">
                            <Copy className="w-4 h-4" /> {isCloning ? 'Đang lưu...' : 'Nhân bản về máy'}
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-x-auto p-8 scroll-smooth custom-scrollbar">
                <div className="flex gap-6 min-h-full items-start">
                    {menuState.days?.map((day, index) => (
                        <div key={day.day_id} className="w-[360px] shrink-0 bg-white rounded-[32px] p-5 flex flex-col border-2 border-transparent shadow-[0_8px_20px_-10px_rgba(255,117,31,0.15)] relative group hover:border-orange-100 hover:shadow-[0_12px_25px_-10px_rgba(255,117,31,0.3)] transition-all duration-300">
                            
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-50 to-transparent rounded-tr-[32px] pointer-events-none"></div>

                            {isOwner && (
                                <button 
                                    onClick={() => {
                                            showModal({
                                                title: 'Xóa Ngày?',
                                                message: 'Bạn có chắc chắn muốn xóa ngày này khỏi thực đơn không? Toàn bộ các bữa ăn trong ngày sẽ bị xóa.',
                                                type: 'warning',
                                                actions: [
                                                    { label: 'Hủy', style: 'secondary' },
                                                    { 
                                                        label: 'Xóa ngay', 
                                                        style: 'danger', 
                                                        onClick: () => dispatch({ type: MENU_ACTIONS.REMOVE_DAY, payload: { dayId: day.day_id } }) 
                                                    }
                                                ]
                                            });
                                        }} 
                                    className="absolute -top-3 -right-3 bg-white text-gray-400 hover:bg-red-500 hover:text-white p-2 rounded-full opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-md z-10 border-2 border-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Header của Ngày */}
                            <div className="flex justify-between items-center mb-5 px-2 relative z-10">
                                <div className="flex items-center gap-2 w-3/5">
                                    <CalendarDays className="w-5 h-5 text-[#ff751f]" />
                                    <input 
                                        type="text" 
                                        value={day.title || ""} 
                                        readOnly 
                                        className="text-xl font-extrabold text-gray-800 bg-transparent border-none focus:ring-0 outline-none w-full p-0 truncate" 
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 text-[#ff751f] px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
                                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                                    <span className="text-sm font-black">{calculateDayCalo(day)}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Kcal</span>
                                </div>
                            </div>
                            
                            {/* Danh sách Bữa ăn */}
                            <div className="flex flex-col gap-4">
                                {day.meals?.map((meal) => (
                                    <div 
                                        key={meal.meal_id} 
                                        className="bg-[#fff9f0] rounded-[24px] border-2 border-orange-50 overflow-hidden relative group/meal transition-colors hover:border-orange-100"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, day.day_id, meal.meal_id)}
                                    >
                                        {/* Header Bữa ăn */}
                                        <div className="flex justify-between items-center px-4 py-3 border-b-2 border-dashed border-orange-100">
                                            <input
                                                type="text"
                                                value={meal.title || (meal.meal_type === 'breakfast' ? 'Sáng' : meal.meal_type === 'lunch' ? 'Trưa' : meal.meal_type === 'dinner' ? 'Tối' : 'Bữa phụ')}
                                                onChange={(e) => dispatch({ type: MENU_ACTIONS.UPDATE_MEAL, payload: { dayId: day.day_id, mealId: meal.meal_id, title: e.target.value }})}
                                                readOnly={!isOwner}
                                                className="text-[15px] font-extrabold text-gray-700 bg-transparent border-none outline-none focus:ring-2 focus:ring-[#ff751f]/20 rounded-lg px-2 w-28 -ml-2 transition-all"
                                            />
                                            <div className="flex items-center gap-1">
                                                {isOwner && (
                                                    <button onClick={() => dispatch({ type: MENU_ACTIONS.REMOVE_MEAL, payload: { dayId: day.day_id, mealId: meal.meal_id }})} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg opacity-0 group-hover/meal:opacity-100 transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {isOwner && (
                                                    <button onClick={() => setSearchModalTarget({ dayId: day.day_id, mealId: meal.meal_id })} className="text-xs text-[#ff751f] hover:text-white font-bold bg-white border border-orange-100 hover:border-[#ff751f] hover:bg-[#ff751f] px-3 py-1.5 rounded-full transition-all shadow-sm">
                                                        + Món
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 flex flex-col gap-3 min-h-[90px]">
                                            {(!meal.recipes || meal.recipes.length === 0) ? (
                                                <div className="h-full flex items-center justify-center border-2 border-dashed border-orange-200 rounded-[16px] py-6 bg-white/50">
                                                    <span className="text-sm font-semibold text-orange-300">{isOwner ? 'Kéo thả món ăn' : 'Chưa có món ăn'}</span>
                                                </div>
                                            ) : (
                                                meal.recipes?.map(recipe => (
                                                    <div 
                                                        key={recipe.recipe_id}
                                                        draggable={isOwner}
                                                        onDragStart={(e) => isOwner && handleDragStart(e, day.day_id, meal.meal_id, recipe.recipe_id)}
                                                        onDragEnd={isOwner ? handleDragEnd : undefined}
                                                        className="group bg-white border-2 border-transparent p-2.5 rounded-[20px] flex flex-col gap-3 shadow-sm hover:shadow-[0_8px_20px_-10px_rgba(255,117,31,0.3)] hover:border-[#ff751f]/30 transition-all cursor-grab active:cursor-grabbing"
                                                    >
                                                        <div className="flex items-center gap-2.5 w-full">
                                                            <GripVertical className="w-4 h-4 text-orange-200 cursor-grab active:cursor-grabbing shrink-0" />
                                                            <img src={recipe.cover_image ? getRecipeImageUrl(recipe.recipe_id, recipe.cover_image) : '/assets/recipe_placeholder.png'} alt={recipe.title} className="w-12 h-12 object-cover rounded-[14px] shadow-sm shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-[14px] font-bold text-gray-800 truncate mb-0.5 group-hover:text-[#ff751f] transition-colors">{recipe.title}</h4>
                                                                <p className="text-[11px] text-gray-400 font-bold">{Math.round((recipe.total_calo || 0) * (recipe.servings_multiplier || 1))} Kcal</p>
                                                            </div>
                                                            {isOwner && (
                                                                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: MENU_ACTIONS.REMOVE_RECIPE, payload: { dayId: day.day_id, mealId: meal.meal_id, recipeId: recipe.recipe_id }})}} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Control Khẩu phần */}
                                                        <div className="flex justify-between items-center bg-orange-50/50 p-2 rounded-[14px] border border-orange-50">
                                                            <span className="text-[11px] text-gray-500 font-bold ml-2 uppercase tracking-wide">Khẩu phần</span>
                                                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-orange-100">
                                                                {isOwner && (
                                                                    <button onClick={(e) => { e.stopPropagation(); dispatch({ type: MENU_ACTIONS.UPDATE_SERVINGS, payload: { dayId: day.day_id, mealId: meal.meal_id, recipeId: recipe.recipe_id, delta: -1 }})}} className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-[#ff751f] font-bold transition-colors">
                                                                        -
                                                                    </button>
                                                                )}
                                                                <span className="text-sm font-black text-gray-800 w-5 text-center">{recipe.servings_multiplier || 1}</span>
                                                                {isOwner && (
                                                                    <button onClick={(e) => { e.stopPropagation(); dispatch({ type: MENU_ACTIONS.UPDATE_SERVINGS, payload: { dayId: day.day_id, mealId: meal.meal_id, recipeId: recipe.recipe_id, delta: 1 }})}} className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-[#ff751f] font-bold transition-colors">
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
                                    <button onClick={() => dispatch({ type: MENU_ACTIONS.ADD_MEAL, payload: { dayId: day.day_id }})} className="w-full py-3 border-2 border-dashed border-orange-200 text-orange-400 font-bold rounded-[20px] hover:border-[#ff751f] hover:text-[#ff751f] hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Thêm Bữa ăn
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {(!menuState.days || menuState.days.length === 0) && (
                        <div className="flex flex-col gap-4 items-center justify-center w-full max-w-lg mx-auto mt-20 p-10 bg-white border-2 border-dashed border-orange-200 rounded-[32px] shadow-sm">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center text-[#ff751f] shadow-inner">
                                <Plus className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-bold text-lg">Chưa có ngày nào trong thực đơn cả!</p>
                            {isOwner && (
                                <button onClick={() => dispatch({ type: MENU_ACTIONS.ADD_DAY })} className="px-6 py-3 bg-gradient-to-r from-[#ff751f] to-yellow-400 text-white font-bold rounded-full shadow-md shadow-orange-300/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
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

const MenuPlannerWrapper = () => (
    <MenuProvider>
        <MenuPlannerBoard />
    </MenuProvider>
);

export default MenuPlannerWrapper;