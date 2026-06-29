import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateMenuMutation, useCloneMenuMutation } from '../../mutations/useMenuMutations';
import { useGlobalModal } from '../../../context/ModalContext';
import { MENU_ACTIONS } from '../../../context/MenuContext';

export const useMenuPlannerUI = (menuId, menuState, dispatch, currentUser, isOwner) => {
    const navigate = useNavigate();
    const { showModal } = useGlobalModal();

    const [searchModalTarget, setSearchModalTarget] = useState(null);
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isAiGenModalOpen, setIsAiGenModalOpen] = useState(false);

    const [draggedItem, setDraggedItem] = useState(null);

    const updateMenuMutation = useUpdateMenuMutation();
    const cloneMenuMutation = useCloneMenuMutation();

    
    const handleSave = async () => {
        try {
            await updateMenuMutation.mutateAsync({ menuId, menuData: menuState });
            showModal({
                type: 'success',
                title: 'Thành công',
                message: 'Thực đơn đã được lưu an toàn!',
                actions: [{ label: 'Tuyệt vời', style: 'primary' }]
            });
        } catch (error) {
            showModal({
                type: 'error',
                title: 'Lỗi',
                message: 'Lưu thất bại: ' + (error.message || 'Có lỗi xảy ra')
            });
        }
    };

    const handleClone = async () => {
        if (!currentUser) {
            showModal({
                type: 'warning',
                title: 'Yêu cầu đăng nhập',
                message: 'Bạn cần đăng nhập để nhân bản và lưu thực đơn này!',
                actions: [
                    { label: 'Hủy', style: 'secondary' },
                    { label: 'Đăng nhập', style: 'primary', onClick: () => navigate('/login') }
                ]
            });
            return;
        }
        try {
            const result = await cloneMenuMutation.mutateAsync(menuId);
            if (result.success) {
                showModal({
                    type: 'success',
                    title: 'Nhân bản thành công',
                    message: 'Thực đơn đã được lưu vào danh sách của bạn. Bạn có thể thoải mái chỉnh sửa!',
                    actions: [{ label: 'Tới thực đơn của tôi', style: 'primary', onClick: () => navigate(`/menus/planner/${result.data.menu_id}`) }]
                });
            } else {
                 showModal({ type: 'error', title: 'Lỗi', message: result.message });
            }
        } catch (error) {
            showModal({ type: 'error', title: 'Lỗi hệ thống', message: error.message || "Có lỗi xảy ra" });
        }
    };

    const handleDragStart = (e, dayId, mealId, recipeId) => {
        if (!isOwner) return; 
        setDraggedItem({ dayId, mealId, recipeId });
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => e.target.classList.add('opacity-50'), 0); 
    };

    const handleDragEnd = (e) => {
        if (!isOwner) return;
        e.target.classList.remove('opacity-50');
        setDraggedItem(null);
    };

    const handleDragOver = (e) => {
        if (!isOwner) return;
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetDayId, targetMealId) => {
        if (!isOwner) return;
        e.preventDefault();
        if (!draggedItem) return;

        if (draggedItem.dayId === targetDayId && draggedItem.mealId === targetMealId) return;

        dispatch({
            type: MENU_ACTIONS.MOVE_RECIPE,
            payload: {
                fromDayId: draggedItem.dayId,
                fromMealId: draggedItem.mealId,
                toDayId: targetDayId,
                toMealId: targetMealId,
                recipeId: draggedItem.recipeId
            }
        });
    };

    return {
        searchModalTarget, setSearchModalTarget,
        isShoppingListOpen, setIsShoppingListOpen,
        isAiModalOpen, setIsAiModalOpen,
        isAiGenModalOpen, setIsAiGenModalOpen,
        
        isSaving: updateMenuMutation.isPending,
        isCloning: cloneMenuMutation.isPending,

        handleSave,
        handleClone,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop
    };
};