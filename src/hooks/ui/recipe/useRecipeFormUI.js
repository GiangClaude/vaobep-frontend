import { useState, useEffect } from 'react';
import { useGlobalModal } from '../../../context/ModalContext';
import { useCreateRecipeMutation, useUpdateRecipeMutation } from '../../mutations/useContentMutations';
import { getRecipeImageUrl } from '../../../utils/imageHelper';
import { useAnalyzePostMutation } from '../../mutations/useAiMutations';
import { useTagQueries } from '../../queries/useTagQueries';
export const useRecipeFormUI = (initialData, isOpen, onClose) => {
    const { showModal } = useGlobalModal();
    const createMutation = useCreateRecipeMutation();
    const updateMutation = useUpdateRecipeMutation();

    const analyzePostMutation = useAnalyzePostMutation();
    const { tags: availableTags = [] } = useTagQueries(); // Lấy list tag từ DB để so khớp
    const [aiResult, setAiResult] = useState(null); 

    const [formData, setFormData] = useState({
        id: null, title: "", description: "", coverImage: "", coverImageFile: null,
        servings: 1, cookTime: 60, totalCalo: "", status: "draft",
        ingredients: [], steps: [], tags: []
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const rId = initialData.recipe_id || initialData.id;
                setFormData({
                    id: rId,
                    title: initialData.title || "",
                    description: initialData.description || "",
                    coverImage: initialData.image,
                    coverImageFile: null,
                    servings: initialData.servings || 1,
                    cookTime: initialData.cookTime || 60,
                    totalCalo: initialData.calories,
                    status: initialData.status || "draft",
                    ingredients: initialData.detailedIngredients ? initialData.detailedIngredients.map(ing => ({
                        id: ing.id || ing.ingredient_id || `existing-${Math.random()}`, 
                        name: ing.name || ing.ingredient_name || "", 
                        unit: ing.unit || ing.unit_name || "",       
                        amount: ing.amount || ing.quantity || "",      
                        isNew: false
                    })) : [],
                    steps: initialData.detailedSteps || [], 
                    tags: initialData.tags || [],
                });
            } else {
                setFormData({
                    id: null, title: "", description: "", coverImage: "", coverImageFile: null,
                    servings: 1, cookTime: 60, totalCalo: "", status: "draft",
                    ingredients: [], steps: [], tags: []
                });
            }
        }
    }, [isOpen, initialData]);

    const handleCoverImageUpload = (file) => {
        if (file) {
            setFormData(prev => ({ ...prev, coverImage: URL.createObjectURL(file), coverImageFile: file }));
        }
    };

    const handleRemoveCoverImage = () => {
        setFormData(prev => ({ ...prev, coverImage: "", coverImageFile: null }));
    };

    const handleSubmit = async (status) => {
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('description', formData.description || "");
        submitData.append('servings', formData.servings);
        submitData.append('cook_time', formData.cookTime);
        submitData.append('total_calo', formData.totalCalo || 0);
        submitData.append('status', status);
        submitData.append('ingredients', JSON.stringify(formData.ingredients));
        
       const stepsForBackend = formData.steps.map((s, idx) => {
            // Đẩy file ảnh mới vào FormData với key chứa index
            if (s.imageFile) {
                submitData.append(`step_image_${idx}`, s.imageFile);
            }
            return { 
                step: s.step, 
                description: s.description, 
                // Gửi kèm link ảnh cũ (nếu có) để backend biết giữ lại, bỏ qua các link blob (ảnh preview cục bộ)
                existingImage: (s.image && !s.image.startsWith('blob:')) ? s.image : null 
            };
        });

        // [FIX] Tương thích ngược: Gửi cả steps (JSON) và instructions (TEXT) đề phòng Backend yêu cầu 1 trong 2
        submitData.append('steps', JSON.stringify(stepsForBackend));
        submitData.append('instructions', formData.steps.map(s => s.description).join('\n\n'));

        // if (formData.coverImageFile) submitData.append('cover_image', formData.coverImageFile);
        if (formData.coverImageFile) {
            // 1. User CÓ CHỌN ẢNH MỚI -> Gửi file lên
            submitData.append('cover_image', formData.coverImageFile);
        } 
        else if (formData.coverImage === "") {
            // 2. User BẤM XÓA ẢNH (coverImage bị rỗng) -> Gửi chuỗi rỗng lên
            // Backend nhận được chuỗi rỗng sẽ tự hiểu là xóa ảnh cũ và tráo thành Default Image
            submitData.append('cover_image', "");
        }
        
        const safeTags = Array.isArray(formData.tags) ? formData.tags.map(t => t.tag_id || t.id) : [];
        if (safeTags.length > 0) submitData.append('tags', JSON.stringify(safeTags));
        try {
            let res;
            if (formData.id) {
                res = await updateMutation.mutateAsync({ recipeId: formData.id, formData: submitData });
            } else {
                res = await createMutation.mutateAsync(submitData);
            }

            // [FIX QUAN TRỌNG] Bóp cổ "Thành công ảo" từ Backend trả về HTTP 200 nhưng success = false
            if (res && res.success === false) {
                throw new Error(res.message || "Lưu thất bại do Backend từ chối dữ liệu");
            }

            onClose(); // [FIX] Đóng Modal form ngay lập tức!
            
            showModal({ 
                title: "Thành công", 
                message: status === 'draft' ? "Đã lưu nháp công thức thành công!" : "Đã đăng công khai công thức!", 
                type: "success" 
            });
            
        } catch (error) {
            showModal({ 
                title: "Lỗi", 
                // Bắt lỗi từ Error ném ra ở trên HOẶC lỗi HTTP từ Axios
                message: error.message || error.response?.data?.message || "Lưu thất bại", 
                type: "error" 
            });
        }
    };

    // ... (code cũ: hàm handleSubmit giữ nguyên)

    // [BẮT ĐẦU THÊM MỚI 3] Các hàm xử lý AI
    const handleCallAI = async () => {
        try {
            // Ép mảng nguyên liệu thành chuỗi để AI đọc hiểu
            const ingredientsString = formData.ingredients
                .map(ing => `${ing.name} (${ing.amount} ${ing.unit})`)
                .join(', ');

            // Ép mảng bước làm thành chuỗi
            const instructionsString = formData.steps
                .map((step, idx) => `Bước ${idx + 1}: ${step.description}`)
                .join('\n');

            const payload = {
                title: formData.title,
                description: formData.description,
                ingredients: ingredientsString,
                instructions: instructionsString
            };

            console.log("RecipeFormUI: ", payload);

            const res = await analyzePostMutation.mutateAsync(payload);
            const aiData = res.data.data; // Backend trả về bọc trong data
            console.log(aiData);
            if (!aiData.is_sufficient) {
                // AI chê thiếu thông tin -> Báo lỗi
                showModal({
                    title: "Thiếu thông tin",
                    message: aiData.message || "Vui lòng nhập thêm Tên món và chi tiết Nguyên liệu để AI có thể tính toán.",
                    type: "warning"
                });
            } else {
                // Thành công -> Lưu vào State để UI hiển thị Card
                setAiResult(aiData);
            }
        } catch (error) {
            showModal({
                title: "Lỗi AI",
                message: error.message || "Không thể gọi trợ lý AI lúc này.",
                type: "error"
            });
        }
    };

    const handleApplyAI = () => {
        if (!aiResult) return;

        // 1. Áp dụng Calo
        const newCalo = aiResult.total_calories;

        // 2. So khớp Tag của AI (String) với Tag hệ thống (Object)
        const mappedTags = aiResult.suggested_tags
            .map(tagName => {
                // Tìm tag object có tên khớp (không phân biệt hoa/thường)
                return availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
            })
            .filter(Boolean); // Bỏ các kết quả undefined (nếu có)

        // Cập nhật State
        setFormData(prev => ({
            ...prev,
            totalCalo: newCalo,
            tags: [...prev.tags, ...mappedTags.filter(newT => !prev.tags.some(oldT => oldT.tag_id === newT.tag_id))] // Thêm tag mới, không trùng lặp
        }));

        // Đóng Card AI
        setAiResult(null);
    };

    const handleCancelAI = () => {
        setAiResult(null);
    };
    // [KẾT THÚC THÊM MỚI 3


    // Sửa lại đoạn return để xuất các hàm AI ra UI
    return {
        formData, setFormData,
        handleCoverImageUpload, handleRemoveCoverImage, handleSubmit,
        isSaving: createMutation.isPending || updateMutation.isPending,
        // [BẮT ĐẦU THÊM MỚI 4]
        aiResult,
        isAiLoading: analyzePostMutation.isPending,
        handleCallAI, handleApplyAI, handleCancelAI
        // [KẾT THÚC THÊM MỚI 4]
    };
};