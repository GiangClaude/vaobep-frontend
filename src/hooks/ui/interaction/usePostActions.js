import { useAuthGuard } from './useAuthGuard';
import { useToggleLikeMutation, useToggleSaveMutation, useReportPostMutation, useRatePostMutation } from '../../mutations/useInteractionMutations';
import { useGlobalModal } from '../../../context/ModalContext';

export const usePostActions = ({ id, type, isLiked, likesCount, isSaved }) => {
    const { requireAuth } = useAuthGuard();
    const { showModal, showReportModal } = useGlobalModal();
    
    const toggleLikeMutation = useToggleLikeMutation();
    const toggleSaveMutation = useToggleSaveMutation();
    const reportMutation = useReportPostMutation();
    const rateMutation = useRatePostMutation();
    
    const handleLike = requireAuth(() => {
        toggleLikeMutation.mutate({ 
            postId: id, 
            postType: type,
            currentIsLiked: isLiked,
            currentLikesCount: likesCount
        });
    });

    const handleSave = requireAuth(() => {
        toggleSaveMutation.mutate({ 
            postId: id, 
            postType: type,
            currentIsSaved: isSaved
        }, {
            onSuccess: () => {
                showModal({ title: "Thành công", message: isSaved ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết vào hồ sơ", type: "success" });
            }
        });
    });

    const handleShare = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        
        const routeName = type === 'article' ? 'article' : 'recipe';
        const url = `${window.location.origin}/${routeName}/${id}`;
        
        navigator.clipboard.writeText(url);
        
        showModal({
            title: "Đã sao chép liên kết",
            message: "Liên kết đã được sao chép vào bộ nhớ tạm!",
            type: "success"
        });
    };

    const handleRate = requireAuth((score, onSuccessCallback) => {
        rateMutation.mutate({ postId: String(id), postType: type, score }, {
            onSuccess: () => {
                showModal({ 
                    title: "Cảm ơn bạn!", 
                    message: "Đánh giá của bạn đã được ghi nhận.", 
                    type: "success" 
                });
                if (onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                showModal({ 
                    title: "Lỗi", 
                    message: err.message || "Không thể gửi đánh giá lúc này.", 
                    type: "error" 
                });
            }
        });
    });

    const handleReport = requireAuth((e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        
        showReportModal(async (reason) => {
            await reportMutation.mutateAsync({ postId: String(id), reason, postType: type });
        });
    });

    return {
        handleLike,
        handleSave,
        handleShare,
        handleReport,
        handleRate,
        isActionLoading: toggleLikeMutation.isPending || toggleSaveMutation.isPending
    };
};