import { useNavigate } from "react-router-dom";
/**
 * Hàm lấy ngẫu nhiên một số lượng phần tử từ mảng.
 */
export const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Hàm điều hướng người dùng sang trang tìm kiếm khi click vào một thẻ tag toàn cục.
 */
export const handleTagClick = (navigate, tagId, type = 'recipes') => {
    navigate(`/${type}?tab=${type}&tags=${tagId}`);
};