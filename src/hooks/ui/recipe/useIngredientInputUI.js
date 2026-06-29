import { useState, useRef, useEffect } from "react";
import { useIngredientsQuery, useUnitsQuery } from "../../queries/useMiscQueries";

export const useIngredientInputUI = (ingredients, onChange) => {
    const { data: dbIngredients = [], isLoading: loadingIngs } = useIngredientsQuery();
    const { data: dbUnits = [], isLoading: loadingUnits } = useUnitsQuery();
    const isLoading = loadingIngs || loadingUnits;

    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [currentIngredient, setCurrentIngredient] = useState({
        id: "", name: "", amount: "", unit: "", isNew: false
    });

    const filteredIngredients = dbIngredients.filter(ing =>
        ing.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectIngredient = (ing, isNew = false) => {
        setCurrentIngredient(prev => ({
            ...prev,
            id: ing.ingredient_id || `new-${Date.now()}`,
            name: ing.name,
            status: ing.status || (isNew ? 'pending' : 'approved'), 
            isNew
        }));
        setSearchTerm(ing.name);
        setShowDropdown(false);
    };

    const handleAddIngredient = () => {
        if (currentIngredient.name && currentIngredient.amount && currentIngredient.unit) {
            onChange([...ingredients, { ...currentIngredient }]);
            setCurrentIngredient({ id: "", name: "", amount: "", unit: "", isNew: false });
            setSearchTerm("");
        }
    };

    const handleRemoveIngredient = (index) => {
        onChange(ingredients.filter((_, i) => i !== index));
    };

    return {
        isLoading,
        dbUnits,
        searchTerm, setSearchTerm,
        showDropdown, setShowDropdown,
        dropdownRef,
        currentIngredient, setCurrentIngredient,
        filteredIngredients,
        handleSelectIngredient,
        handleAddIngredient,
        handleRemoveIngredient
    };
};