import { useState, useRef, useEffect } from "react";
import { X, User, Lock, Crown, Camera, Save, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithFallback from "../figma/ImageWithFallBack";
import { getAvatarUrl } from "../../utils/imageHelper";

export function AccountSettingsModal({ 
  isOpen, 
  onClose, 
  user, 
  // Props cho Profile
  onSaveProfile,
  isUpdatingProfile,
  // Props cho Đổi Mật Khẩu
  passwords, 
  setPasswords, 
  errors, 
  resetFields, 
  isChangingPass, 
  handleChangePassword 
}) {
  const [activeTab, setActiveTab] = useState("info");
  
  // --- STATE CHO ĐỔI THÔNG TIN ---
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar);
  const [previewCover, setPreviewCover] = useState(user?.coverImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null); 
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
  });

  // Đồng bộ data khi mở modal
  useEffect(() => {
    if (user && isOpen) {
      setProfileData({ fullName: user.fullName, bio: user.bio });
      setPreviewAvatar(user.avatar);
      setPreviewCover(user.coverImage);
    }
  }, [user, isOpen]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedCoverFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewCover(objectUrl);
    }
    };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
    }
  };

  const submitProfileUpdate = async () => {
    await onSaveProfile({ 
        ...profileData, 
        avatarFile: selectedFile,
        coverFile: selectedCoverFile
    });
  };

  // --- HÀM ĐÓNG MODAL ---
  const handleClose = () => {
    resetFields(); // Reset form mật khẩu
    setSelectedFile(null); // Xóa file đang chọn hờ
    setSelectedCoverFile(null); 
    setActiveTab("info"); // Quay về tab mặc định
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl h-[85vh] max-h-[700px]"
        >
          
          {/* CỘT TRÁI: MENU ĐIỀU HƯỚNG */}
          <div className="w-full md:w-72 bg-gray-50 border-r border-gray-100 p-6 flex flex-col flex-shrink-0">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Cài đặt</h2>
            
            <nav className="flex-1 space-y-2">
              <button onClick={() => setActiveTab("info")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all ${activeTab === "info" ? "bg-white text-[#ff6b35] shadow-sm border border-gray-100" : "text-gray-600 hover:bg-gray-200"}`}>
                <User className="w-5 h-5" /> Hồ sơ cá nhân
              </button>
              <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all ${activeTab === "security" ? "bg-white text-[#ff6b35] shadow-sm border border-gray-100" : "text-gray-600 hover:bg-gray-200"}`}>
                <Lock className="w-5 h-5" /> Bảo mật & Mật khẩu
              </button>
              <button onClick={() => setActiveTab("vip")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all ${activeTab === "vip" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}>
                <Crown className="w-5 h-5" /> Gói thành viên
              </button>
            </nav>
          </div>

          {/* CỘT PHẢI: NỘI DUNG FORM */}
          <div className="flex-1 bg-white relative flex flex-col h-full overflow-hidden">
            {/* Nút tắt */}
            <div className="absolute top-4 right-4 z-10">
                <button onClick={handleClose} className="p-2.5 bg-gray-100 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-10">
                
                {/* 1. TAB HỒ SƠ */}
                {activeTab === "info" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl">
                        <h3 className="text-2xl font-bold mb-8 text-gray-800">Thông tin cá nhân</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Ảnh bìa</label>
                                <div 
                                    className="relative w-full h-32 md:h-40 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 group cursor-pointer hover:border-[#ff6b35] transition-colors"
                                    onClick={() => coverInputRef.current?.click()}
                                >
                                    {previewCover ? (
                                        <img 
                                            src={previewCover} // Hàm lấy URL
                                            alt="Cover Preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-r from-gray-100 to-gray-200">
                                            <Camera className="w-8 h-8 mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Chưa có ảnh bìa</span>
                                        </div>
                                    )}
                                    
                                    <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                                    
                                    {/* Overlay khi hover */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2 text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                                            <Camera className="w-5 h-5" /> Thay đổi ảnh bìa
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Avatar */}
                            <div className="flex items-center gap-6">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                                        <ImageWithFallback src={previewAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Ảnh đại diện</p>
                                    <p className="text-sm text-gray-500">Nhấn vào ảnh để thay đổi</p>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Họ và Tên</label>
                                <input type="text" value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 outline-none transition-all text-gray-800 font-medium" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Tiểu sử (Bio)</label>
                                <textarea rows="4" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 outline-none transition-all resize-none text-gray-800" placeholder="Viết vài dòng giới thiệu về bản thân..." />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Email (Không thể thay đổi)</label>
                                <input type="email" value={user.email} disabled className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>

                            <button onClick={submitProfileUpdate} disabled={isUpdatingProfile} className="w-full mt-4 bg-[#ff6b35] hover:bg-[#e85d2b] text-white py-3.5 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2">
                                {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Lưu thay đổi</>}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 2. TAB BẢO MẬT (ĐỔI MẬT KHẨU) */}
                {activeTab === "security" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl">
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">Đổi Mật Khẩu</h3>
                        <p className="text-gray-500 mb-8">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh.</p>

                        {errors.api && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="text-sm font-medium">{errors.api}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Mật khẩu hiện tại</label>
                                <input type="password" autoComplete="new-password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} className={`w-full px-4 py-3.5 rounded-xl border ${errors.oldPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20'} outline-none transition-all`} placeholder="Nhập mật khẩu cũ" />
                                {errors.oldPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.oldPassword}</p>}
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Mật khẩu mới</label>
                                <input type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className={`w-full px-4 py-3.5 rounded-xl border ${errors.newPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20'} outline-none transition-all`} placeholder="Nhập mật khẩu mới" />
                                {errors.newPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.newPassword}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Xác nhận mật khẩu mới</label>
                                <input type="password" autoComplete="new-password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className={`w-full px-4 py-3.5 rounded-xl border ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20'} outline-none transition-all`} placeholder="Nhập lại mật khẩu mới" />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
                            </div>

                            <button onClick={handleChangePassword} disabled={isChangingPass} className="w-full mt-6 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2">
                                {isChangingPass ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-5 h-5" /> Cập nhật mật khẩu</>}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 3. TAB VIP (GÓI THÀNH VIÊN) */}
                {activeTab === "vip" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl text-center pt-8">
                        <div className="inline-flex bg-yellow-50 p-6 rounded-full mb-6">
                            <Crown className="w-16 h-16 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Nâng cấp tài khoản VIP</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Mở khóa tính năng đăng công thức không giới hạn, xem bài viết học thuật độc quyền và trải nghiệm AI tự động lên thực đơn!
                        </p>
                        
                        {user.role === 'vip' || user.role === 'pro' ? (
                            <div className="bg-green-50 text-green-600 font-bold py-4 rounded-xl border border-green-200">
                                Đang sử dụng gói {user.role.toUpperCase()}
                            </div>
                        ) : (
                            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-orange-300 transition-all transform hover:-translate-y-1">
                                Xem Bảng Giá Khuyến Mãi
                            </button>
                        )}
                    </motion.div>
                )}

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}