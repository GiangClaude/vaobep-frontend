import { useAuth } from '../../../AuthContext';
import { useGlobalModal } from '../../../context/ModalContext';
import { useNavigate } from 'react-router-dom';

export const useAuthGuard = () => {
    const { currentUser } = useAuth();
    const { showModal, hideModal } = useGlobalModal();
    const navigate = useNavigate();

    const requireAuth = (callback) => {
        return async (...args) => {
            const firstArg = args[0];
            if (firstArg && typeof firstArg.stopPropagation === 'function') {
                firstArg.stopPropagation();
            }
            
            if (!currentUser) {
                showModal({
                    title: "Yêu cầu đăng nhập",
                    message: "Bạn cần đăng nhập để thực hiện thao tác này.",
                    type: "warning",
                    actions: [
                        { label: "Hủy", onClick: hideModal, style: "secondary" },
                        { label: "Đăng nhập ngay", onClick: () => { hideModal(); navigate("/login"); }, style: "primary" }
                    ]
                });
                return false; 
            }
            
            return await callback(...args);
        };
    };

    return { requireAuth, isAuthenticated: !!currentUser };
};