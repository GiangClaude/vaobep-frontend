
import { useNavigate } from 'react-router-dom';
import { useCreateMenuMutation } from '../../mutations/useMenuMutations';
import { useGlobalModal } from '../../../context/ModalContext';
export const useMenuListUI = () => {
    const navigate = useNavigate();
    const {showModal} = useGlobalModal();
    const createMenuMutation = useCreateMenuMutation();

    const handleCreateBlankMenu = async () => {
        try {
            const result = await createMenuMutation.mutateAsync({ 
                name: "Thực đơn mới chưa đặt tên",
                days: [] 
            });
            
            if (result.success && result.data.menu_id) {
                navigate(`/menus/planner/${result.data.menu_id}`);
            } else {
                showModal({ type: 'error', title: 'Lỗi sinh thực đơn', message: result.message || "Có lỗi xảy ra" });
            }
        } catch (error) {
            showModal({ type: 'error', title: 'Lỗi tạo thực đơn', message: error.message || "Có lỗi xảy ra" });
        }
    };

    return {
        handleCreateBlankMenu,
        isCreating: createMenuMutation.isPending 
    };
};