import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    X, ChefHat, Clock, Flame, Users, Plus, Trash2, Image as ImageIcon, 
    FileText, Star, MessageCircle, ThumbsUp, CheckCircle, AlertCircle, Save 
} from 'lucide-react';
import { getRecipeImageUrl, getAvatarUrl } from '../../utils/imageHelper';

const RecipeModal = ({ isOpen, onClose, mode, recipeData, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        servings: 1,
        cook_time: 0,
        total_calo: 0,
        instructions: '',
        status: 'public',
        is_trust: 0,
        cover_image: null,
        ingredients: [] 
    });

    const [steps, setSteps] = useState([]);

    const [currentIngredient, setCurrentIngredient] = useState({
        name: '', quantity: '', unit: ''
    });

    const [previewImage, setPreviewImage] = useState(null);

   useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                setFormData({
                    title: '', description: '', servings: 2, cook_time: 30, total_calo: 500,
                    instructions: '', status: 'public', is_trust: 0, cover_image: null, ingredients: []
                });
                setSteps([{ id: Date.now(), description: "", image: "" }]);
                setPreviewImage(null);
            } else if (recipeData) {
                const parsedSteps = recipeData.instructions 
                    ? recipeData.instructions.split('\n').filter(s => s.trim() !== '').map((desc, index) => ({
                        id: `existing-${index}`,
                        description: desc,
                        image: ""
                      }))
                    : [{ id: Date.now(), description: "", image: "" }];
                setFormData({
                    title: recipeData.title || '',
                    description: recipeData.description || '',
                    servings: recipeData.servings || 1,
                    cook_time: recipeData.cook_time || 0,
                    total_calo: recipeData.total_calo || 0,
                    instructions: recipeData.instructions || '',
                    status: recipeData.status || 'public',
                    is_trust: recipeData.is_trust || 0,
                    cover_image: null,
                    ingredients: recipeData.ingredients || [] 
                });
            }
        }
    }, [isOpen, mode, recipeData]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, cover_image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleAddIngredient = () => {
        if (currentIngredient.name && currentIngredient.quantity && currentIngredient.unit) {
            setFormData({
                ...formData,
                ingredients: [...formData.ingredients, { ...currentIngredient }]
            });
            setCurrentIngredient({ name: '', quantity: '', unit: '' }); // Reset input
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngs = [...formData.ingredients];
        newIngs[index][field] = value;
        setFormData({ ...formData, ingredients: newIngs });
    };

    const handleRemoveIngredient = (index) => {
        const newIngs = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: newIngs });
    };

    const handleAddStep = () => {
        setSteps([...steps, { id: `step-${Date.now()}`, description: "", image: "" }]);
    };

    const handleUpdateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const handleRemoveStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleStepImageUpload = (index, event) => {
        const file = event.target.files?.[0];
        if (file) {
            const mockUrl = URL.createObjectURL(file);
            handleUpdateStep(index, "image", mockUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (mode === 'create') {
            const submission = new FormData();
            submission.append('title', formData.title);
            submission.append('description', formData.description);
            submission.append('servings', formData.servings);
            submission.append('cook_time', formData.cook_time);
            submission.append('total_calo', formData.total_calo);
            submission.append('instructions', formData.instructions);
            if (formData.cover_image) submission.append('cover_image', formData.cover_image);
            submission.append('ingredients', JSON.stringify(formData.ingredients));
            
            onSubmit(submission);
        } else if (mode === 'edit') {
            onSubmit({
                status: formData.status,
                is_trust: parseInt(formData.is_trust)
            });
        }
    };

    const titleMap = {
        'create': 'Tạo công thức mới',
        'edit': 'Chỉnh sửa trạng thái',
        'view': 'Chi tiết công thức'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#fff9f0] rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] px-6 py-4 flex justify-between items-center shrink-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                                
                                <div className="flex items-center gap-3 relative z-10 text-white">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                        {mode === 'view' ? <FileText size={20} /> : <ChefHat size={20} />}
                                    </div>
                                    <h3 className="text-xl font-bold">{titleMap[mode]}</h3>
                                </div>
                                <button onClick={onClose} className="relative z-10 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#fff9f0]">
                                
                                {mode === 'view' && recipeData && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                                <img 
                                                    src={getRecipeImageUrl(recipeData.recipe_id, recipeData.cover_image)} 
                                                    alt="Cover" 
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <h2 className="text-2xl font-black text-gray-800 leading-tight">{recipeData.title}</h2>
                                                
                                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl shadow-sm border border-orange-100 w-fit">
                                                    <img 
                                                        src={getAvatarUrl(recipeData.user_id, recipeData.author_avatar)} 
                                                        className="w-8 h-8 rounded-full border border-gray-200" 
                                                        alt="Author"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-400 font-bold uppercase">Tác giả</span>
                                                        <span className="text-sm font-bold text-gray-700">{recipeData.author_name}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <Flame size={12} /> {recipeData.total_calo} Kcal
                                                    </span>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <Clock size={12} /> {recipeData.cook_time} phút
                                                    </span>
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <Users size={12} /> {recipeData.servings} người
                                                    </span>
                                                    {recipeData.is_trust === 1 && (
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
                                                            <CheckCircle size={12} /> Trusted
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center justify-center">
                                                <ThumbsUp className="text-[#ff6b35] mb-1" size={20} />
                                                <span className="font-bold text-lg text-gray-800">{recipeData.like_count || 0}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Yêu thích</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center justify-center">
                                                <Star className="text-yellow-500 mb-1" size={20} fill="currentColor" />
                                                <span className="font-bold text-lg text-gray-800">{recipeData.rating_avg_score || 0}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Đánh giá</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center justify-center">
                                                <MessageCircle className="text-blue-500 mb-1" size={20} />
                                                <span className="font-bold text-lg text-gray-800">{recipeData.comment_count || 0}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Bình luận</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
                                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <span className="bg-orange-100 p-1 rounded text-[#ff6b35]"><ChefHat size={16}/></span> 
                                                    Nguyên liệu
                                                </h4>
                                                <ul className="space-y-2">
                                                    {recipeData.ingredients?.map((ing, idx) => (
                                                        <li key={idx} className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-1 last:border-0">
                                                            <span className="font-medium text-gray-700">{ing.ingredient_name}</span>
                                                            <span className="text-gray-500 font-bold bg-gray-50 px-2 py-0.5 rounded">{ing.quantity} {ing.unit_name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
                                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <span className="bg-blue-100 p-1 rounded text-blue-600"><FileText size={16}/></span> 
                                                    Cách làm
                                                </h4>
                                                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                                    {recipeData.instructions}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === 'create' && (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">

                                        <div>
                                            <label className="block text-lg mb-3 text-gray-800 flex items-center gap-2 font-bold">📸 Ảnh bìa công thức</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-[#ff6b35] transition-all cursor-pointer relative h-48">
                                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                {previewImage ? (
                                                    <img src={previewImage} className="h-full w-full object-contain rounded-lg" alt="Preview" />
                                                ) : (
                                                    <div className="text-center text-gray-400">
                                                        <ImageIcon size={40} className="mx-auto mb-2 opacity-50"/>
                                                        <span className="text-sm font-medium">Nhấn để tải ảnh bìa lên</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên món ăn <span className="text-red-500">*</span></label>
                                                <input type="text" required placeholder="Ví dụ: Phở bò gia truyền..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none transition-colors bg-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Khẩu phần</label>
                                                    <div className="relative">
                                                        <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                                        <input type="number" className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none transition-colors bg-white" value={formData.servings} onChange={e => setFormData({...formData, servings: e.target.value})} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-lg font-bold text-gray-700 mb-1">Thời gian</label>
                                                    <div className="relative">
                                                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                                        <input type="number" className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none transition-colors bg-white" value={formData.cook_time} onChange={e => setFormData({...formData, cook_time: e.target.value})} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-lg font-bold text-gray-700 mb-1">Calo</label>
                                                    <div className="relative">
                                                        <Flame size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                                        <input type="number" className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none transition-colors bg-white" value={formData.total_calo} onChange={e => setFormData({...formData, total_calo: e.target.value})} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-lg font-bold text-gray-700 mb-1">Mô tả ngắn</label>
                                                <textarea className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b35] outline-none transition-colors bg-white min-h-[80px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Giới thiệu sơ lược về món ăn..."></textarea>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-3 text-gray-800 flex items-center gap-2 font-bold">
                                                Nguyên liệu <span className="text-red-500">*</span>
                                            </label>
                                            
                                            {formData.ingredients.length > 0 && (
                                                <div className="mb-4 space-y-2">
                                                    <AnimatePresence>
                                                        {formData.ingredients.map((ing, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: 20 }}
                                                                className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-xl border border-[#ffc857]/30"
                                                            >
                                                                <div className="flex-1 font-medium text-gray-800">{ing.name}</div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <span className="font-semibold text-[#ff6b35]">{ing.quantity}</span>
                                                                    <span>{ing.unit}</span>
                                                                </div>
                                                                <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            )}

                                            <div className="bg-white rounded-xl border-2 border-[#ffc857]/30 p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                                    <div className="md:col-span-5">
                                                        <label className="block text-sm mb-1.5 text-gray-700">Tên nguyên liệu</label>
                                                        <input 
                                                            placeholder="VD: Thịt bò..." 
                                                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] focus:outline-none transition-all"
                                                            value={currentIngredient.name}
                                                            onChange={e => setCurrentIngredient({...currentIngredient, name: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="block text-sm mb-1.5 text-gray-700">Số lượng</label>
                                                        <input 
                                                            type="number"
                                                            placeholder="100" 
                                                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] focus:outline-none transition-all"
                                                            value={currentIngredient.quantity}
                                                            onChange={e => setCurrentIngredient({...currentIngredient, quantity: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="block text-sm mb-1.5 text-gray-700">Đơn vị</label>
                                                        <input 
                                                            placeholder="gram, kg..." 
                                                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] focus:outline-none transition-all"
                                                            value={currentIngredient.unit}
                                                            onChange={e => setCurrentIngredient({...currentIngredient, unit: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1 flex items-end">
                                                        <button 
                                                            type="button"
                                                            onClick={handleAddIngredient}
                                                            disabled={!currentIngredient.name || !currentIngredient.quantity || !currentIngredient.unit}
                                                            className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white p-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-3 text-gray-800 flex items-center gap-2 font-bold">
                                                📝 Các bước thực hiện <span className="text-red-500">*</span>
                                            </label>
                                            
                                            <div className="space-y-4">
                                                <AnimatePresence>
                                                    {steps.map((step, index) => (
                                                        <motion.div
                                                            key={step.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="bg-white rounded-xl border-2 border-[#ffc857]/30 p-5"
                                                        >
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                                                                        {index + 1}
                                                                    </div>
                                                                    <h4 className="font-semibold text-gray-800">Bước {index + 1}</h4>
                                                                </div>
                                                                <button type="button" onClick={() => handleRemoveStep(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="md:col-span-2">
                                                                    <label className="block text-sm mb-1.5 text-gray-700">Mô tả chi tiết</label>
                                                                    <textarea
                                                                        value={step.description}
                                                                        onChange={(e) => handleUpdateStep(index, "description", e.target.value)}
                                                                        placeholder="Mô tả chi tiết cách thực hiện..."
                                                                        rows={4}
                                                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] focus:outline-none transition-all resize-none"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm mb-1.5 text-gray-700">Ảnh minh họa</label>
                                                                    {step.image ? (
                                                                        <div className="relative group h-full max-h-[120px]">
                                                                            <img src={step.image} alt={`Step ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-[#ffc857]/30"/>
                                                                            <button type="button" onClick={() => handleUpdateStep(index, "image", "")} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                                                                        </div>
                                                                    ) : (
                                                                        <label className="h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b35] hover:bg-orange-50/50 transition-all group">
                                                                            <input type="file" accept="image/*" onChange={(e) => handleStepImageUpload(index, e)} className="hidden"/>
                                                                            <span className="text-xs text-gray-500">Tải ảnh</span>
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                                
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    type="button"
                                                    onClick={handleAddStep}
                                                    className="w-full border-2 border-dashed border-[#ff6b35] text-[#ff6b35] py-3 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2 font-medium"
                                                >
                                                    <ImageIcon className="w-5 h-5" /> Thêm bước mới
                                                </motion.button>
                                            </div>
                                        </div>


                                        
                                        <button type="submit" className="hidden"></button>
                                    </form>
                                )}

                                {mode === 'edit' && (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                                            <AlertCircle className="text-[#ff6b35] shrink-0 mt-0.5" size={20} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái bài viết</label>
                                            <select 
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-[#ff6b35] outline-none transition-all cursor-pointer"
                                                value={formData.status}
                                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            >
                                                <option value="public">Public</option>
                                                <option value="banned">Ban</option>
                                            </select>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-green-200 transition-colors cursor-pointer" onClick={() => setFormData({...formData, is_trust: formData.is_trust === 1 ? 0 : 1})}>
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${formData.is_trust === 1 ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                                                {formData.is_trust === 1 && <CheckCircle size={16} className="text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-bold text-gray-800 block">Xác thực công thức (Trusted)</span>
                                                <span className="text-xs text-gray-500">Gắn huy hiệu uy tín cho công thức này</span>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {mode !== 'view' && (
                                <div className="p-6 border-t border-orange-100 bg-white flex justify-end gap-3 shrink-0">
                                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-gray-100 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                                        Hủy bỏ
                                    </button>
                                    <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] transition-all flex items-center gap-2">
                                        <Save size={18} />
                                        {mode === 'create' ? 'Tạo Công Thức' : 'Lưu Thay Đổi'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RecipeModal;