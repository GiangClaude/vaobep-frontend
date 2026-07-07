
import { useNavigate } from 'react-router-dom';
import { useCreateMenuMutation, useDeleteMenuMutation} from '../../mutations/useMenuMutations';
import { useGlobalModal } from '../../../context/ModalContext';
export const useMenuListUI = () => {
    const navigate = useNavigate();
    const {showModal} = useGlobalModal();
    const createMenuMutation = useCreateMenuMutation();
    const deleteMenuMutation = useDeleteMenuMutation();

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

    const handleDeleteMenu = (menuId) => {
        try {
            showModal({
                type: 'confirm',
                title: 'Xác nhận xóa thực đơn',
                message: 'Bạn có chắc chắn muốn xóa thực đơn này? Hành động này không thể hoàn tác.',
                actions: [
                    { label: 'Không', style: 'secondary' },
                    { label: 'Có', style: 'danger', onClick: async () => {
                        try {
                            await deleteMenuMutation.mutateAsync(menuId);
                            showModal({ type: 'success', title: 'Thành công', message: 'Thực đơn đã được xóa.' });
                        } catch (error) {
                            showModal({ type: 'error', title: 'Lỗi xóa thực đơn', message: "Có lỗi xảy ra" });
                        }
                    }
                    }
                ]
            })
        } catch (error) {
            showModal({ type: 'error', title: 'Lỗi xóa thực đơn', message: "Có lỗi xảy ra" });
        }
    }

    return {
        handleCreateBlankMenu,
        handleDeleteMenu,
        isDeleting: deleteMenuMutation.isPending,
        isCreating: createMenuMutation.isPending 
    };
};