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
    const { tags: availableTags = [] } = useTagQueries(); 
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
            if (s.imageFile) {
                submitData.append(`step_image_${idx}`, s.imageFile);
            }
            return { 
                step: s.step, 
                description: s.description, 
                existingImage: (s.image && !s.image.startsWith('blob:')) ? s.image : null 
            };
        });

        submitData.append('steps', JSON.stringify(stepsForBackend));
        submitData.append('instructions', formData.steps.map(s => s.description).join('\n\n'));

        if (formData.coverImageFile) {
            submitData.append('cover_image', formData.coverImageFile);
        } 
        else if (formData.coverImage === "") {
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

            if (res && res.success === false) {
                throw new Error(res.message || "Lưu thất bại do Backend từ chối dữ liệu");
            }

            onClose(); 
            
            showModal({ 
                title: "Thành công", 
                message: status === 'draft' ? "Đã lưu nháp công thức thành công!" : "Đã đăng công khai công thức!", 
                type: "success" 
            });
            
        } catch (error) {
            showModal({ 
                title: "Lỗi", 
                message: error.message || error.response?.data?.message || "Lưu thất bại", 
                type: "error" 
            });
        }
    };


    const handleCallAI = async () => {
        try {
            const ingredientsString = formData.ingredients
                .map(ing => `${ing.name} (${ing.amount} ${ing.unit})`)
                .join(', ');

            const instructionsString = formData.steps
                .map((step, idx) => `Bước ${idx + 1}: ${step.description}`)
                .join('\n');

            const payload = {
                title: formData.title,
                description: formData.description,
                ingredients: ingredientsString,
                instructions: instructionsString
            };


            const res = await analyzePostMutation.mutateAsync(payload);
            const aiData = res.data.data; 
            console.log(aiData);
            if (!aiData.is_sufficient) {
                showModal({
                    title: "Thiếu thông tin",
                    message: aiData.message || "Vui lòng nhập thêm Tên món và chi tiết Nguyên liệu để AI có thể tính toán.",
                    type: "warning"
                });
            } else {
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

        const newCalo = aiResult.total_calories;

        const mappedTags = aiResult.suggested_tags
            .map(tagName => {
                return availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
            })
            .filter(Boolean); 

        setFormData(prev => ({
            ...prev,
            totalCalo: newCalo,
            tags: [...prev.tags, ...mappedTags.filter(newT => !prev.tags.some(oldT => oldT.tag_id === newT.tag_id))] // Thêm tag mới, không trùng lặp
        }));

        setAiResult(null);
    };

    const handleCancelAI = () => {
        setAiResult(null);
    };

    return {
        formData, setFormData,
        handleCoverImageUpload, handleRemoveCoverImage, handleSubmit,
        isSaving: createMutation.isPending || updateMutation.isPending,
        aiResult,
        isAiLoading: analyzePostMutation.isPending,
        handleCallAI, handleApplyAI, handleCancelAI
    };
};