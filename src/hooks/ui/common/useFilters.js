import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook quản lý bộ lọc chung cho các danh sách (Recipes, Articles...)
 */
export const useFilters = (initialFilters = {}) => {
    const [searchParams] = useSearchParams();

    const getInitialState = () => {
        const state = { ...initialFilters };
        
        searchParams.forEach((value, key) => {
            if (key in state) {
                if (Array.isArray(state[key])) {
                    state[key] = value ? value.split(',') : [];
                } else if (typeof state[key] === 'number') {
                    state[key] = Number(value);
                } else {
                    state[key] = value;
                }
            }
        });
        
        return state;
    };

    const [filters, setFilters] = useState(getInitialState);
    const [debouncedFilters, setDebouncedFilters] = useState(getInitialState);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const replaceFilters = (newFiltersObj) => {
        setFilters(newFiltersObj);
    };

    return { filters, debouncedFilters, updateFilter, replaceFilters };
};