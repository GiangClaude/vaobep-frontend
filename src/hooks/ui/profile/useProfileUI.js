import { useState } from 'react';
import { useGlobalModal } from '../../../context/ModalContext';
import { 
    useChangePasswordMutation, 
    useCheckInMutation, 
    useUpdateProfileMutation,
    useClaimRewardMutation
} from '../../mutations/useProfileMutations';
import { useAuth } from '../../../AuthContext';

export const useProfileUI = () => {
    const { showModal } = useGlobalModal();
    const { setCurrentUser, refreshProfile } = useAuth(); 

    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
    
    const [selectedBox, setSelectedBox] = useState(null);
    const [receivedItems, setReceivedItems] = useState([]);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    const changePassMutation = useChangePasswordMutation();
    const checkInMutation = useCheckInMutation();
    const updateProfileMutation = useUpdateProfileMutation();
    const claimRewardMutation = useClaimRewardMutation();

    const handleSaveProfile = async (data) => {
        const formData = new FormData();
        if (data.fullName) formData.append('fullName', data.fullName);
        if (data.bio) formData.append('bio', data.bio);
        
        if (data.avatarFile) formData.append('avatar', data.avatarFile);
        if (data.coverFile) {
                formData.append('cover_image', data.coverFile); 
            }
        try {
            const result = await updateProfileMutation.mutateAsync(formData);
            if (result.success) {
                setCurrentUser(result.data); 
                showModal({ type: 'success', title: 'Thành công!', message: "Cập nhật hồ sơ thành công!", actions: [{ label: 'Đóng', style: 'primary' }] });
            } else {
                showModal({ type: 'error', title: 'Thất bại', message: "Cập nhật thất bại", actions: [{ label: 'Đóng', style: 'danger' }] });
            }
        } catch (error) {
            showModal({ type: 'error', title: 'Thất bại', message: error.message, actions: [{ label: 'Đóng', style: 'danger' }] });
        }
    };

    const handleCheckIn = async () => {
        try {
            const result = await checkInMutation.mutateAsync();
            showModal({ type: 'success', title: 'Thành công!', message: result.message || 'Điểm danh thành công!', actions: [{ label: 'Đóng', style: 'primary' }] });
            await refreshProfile(); 
        } catch (error) {
            showModal({ type: 'warning', title: 'Thông báo', message: error.response?.data?.message || error.message || 'Hôm nay bạn đã điểm danh rồi.', actions: [{ label: 'Đóng', style: 'primary' }] });
        }
    };

    const handleChangePassword = async () => {
        const newErrors = {};
        if (!passwords.oldPassword) newErrors.oldPassword = 'Nhập mật khẩu hiện tại';
        if (passwords.newPassword.length < 8) newErrors.newPassword = 'Mật khẩu > 8 ký tự';
        if (passwords.newPassword !== passwords.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await changePassMutation.mutateAsync({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            setIsChangePassModalOpen(false);
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            showModal({ type: 'success', title: 'Thành công!', message: 'Mật khẩu đã được cập nhật.', actions: [{ label: 'OK', style: 'primary' }] });
        } catch (err) {
            setErrors({ api: err.message });
        }
    };

    const handleOpenReward = async (reward) => {
        setSelectedBox(reward); 
        setIsRewardModalOpen(true); 
        setIsOpening(true);
        
        try {
            const result = await claimRewardMutation.mutateAsync(reward.user_reward_id);
            setReceivedItems(result.data);
            await refreshProfile();
        } catch (err) {
            showModal({ type: 'error', title: 'Lỗi khi mở quà', message: err.message || "Có lỗi xảy ra" });
            setIsRewardModalOpen(false);
        } finally {
            setIsOpening(false);
        }
    };

    return {
        handleSaveProfile,
        isUpdatingProfile: updateProfileMutation.isPending,
        
        passwords, setPasswords, errors, resetFields: () => setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }),
        isChangingPass: changePassMutation.isPending,
        handleChangePassword,
        isChangePassModalOpen, setIsChangePassModalOpen,

        handleCheckIn,

        selectedBox, receivedItems, isRewardModalOpen, setIsRewardModalOpen, isOpening, handleOpenReward
    };
};