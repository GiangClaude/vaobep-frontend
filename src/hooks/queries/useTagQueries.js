import { useState, useEffect } from 'react';
import tagApi from '../../api/tagApi'; 

export function useTagQueries() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                const res = await tagApi.getAllTags();
                if (res.success) {
                    setTags(res.data);
                } else if (Array.isArray(res.data)) {
                    setTags(res.data);
                }
            } catch (error) {
                setError(error.message || "Lỗi khi tải danh sách tags");
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return { tags, loading, error };
}