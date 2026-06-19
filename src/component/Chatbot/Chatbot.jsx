import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipeImageUrl } from '../../utils/imageHelper';
// import useChatbot from '../../hooks/useChatbot';
import { useChatbotUI } from '../../hooks/ui/chatbot/useChatbotUI';

function Chatbot() {
  const navigate = useNavigate();
  
  const { 
      open, toggleOpen, 
      input, setInput, 
      messages, loading, currentContext, quicks, 
      sendMessage, handleClearChat 
  } = useChatbotUI();

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
    toggleOpen(); 
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* NÚT BẬT/TẮT */}
      {/* SỬA ĐỔI GIAO DIỆN NÚT CHAT: Thêm trình giữ chỗ logo */}
      <div 
        onClick={toggleOpen}
        className="w-[60px] h-[60px] bg-orange-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.2)] ml-auto transition-transform hover:scale-105"
      >
        {open ? (
          <span className="font-bold text-lg">✕</span>
        ) : (
          // TRÌNH GIỮ CHỖ LOGO ĐEN TRẮNG
          <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center overflow-hidden">
            {/* SVG TRÌNH GIỮ CHỖ ĐẦU BẾP ĐEN TRẮNG (Thay thế bằng logo của bạn)
            <svg viewBox="0 0 24 24" className="w-[24px] h-[24px]" fill="black">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6C9.79,6 8,7.79 8,10C8,12.21 9.79,14 12,14C14.21,14 16,12.21 16,10C16,7.79 14.21,6 12,6M12,8C13.1,8 14,8.9 14,10C14,11.1 13.1,12 12,12C10.9,12 10,11.1 10,10C10,8.9 10.9,8 12,8M12,15C9.33,15 4,16.34 4,19V20H20V19C20,16.34 14.67,15 12,15M6,18C6.56,17.22 9.53,17 12,17C14.47,17 17.44,17.22 18,18H6Z" />
            </svg> */}
            <img src="/assets/logo/2.png" alt="" className="w-[36px] h-[36px]"/>
          </div>
        )}
      </div>

      {/* KHUNG CỬA SỔ CHAT */}
      {open && (
        <div className="absolute bottom-[80px] right-0 w-[350px] h-[500px] bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-orange-400 text-white p-[15px] font-bold flex justify-between items-center">
            <span>Trợ lý Vào Bếp</span>
            <button 
              onClick={handleClearChat} 
              title="Xóa lịch sử trò chuyện"
              className="bg-transparent border-none text-white text-lg cursor-pointer px-1 transition-transform duration-200 hover:scale-110 hover:text-[#ffcccc]"
            >
              🗑️
            </button>
          </div>
          
          {/* BANNER GHIM NGỮ CẢNH */}
          {currentContext && (
            <div className="bg-orange-50 text-[#ff6b35] text-xs font-medium text-center py-2 border-b border-orange-100 flex items-center justify-center gap-1 shadow-inner">
                <span>📍</span> Đang tham chiếu nội dung bài viết hiện tại
            </div>
          )}

          {/* BODY: KHU VỰC CHAT */}
          <div className="flex-1 p-[15px] overflow-y-auto bg-[#f8f9fa] flex flex-col gap-2.5">
            {messages.length === 0 && (
                <div className="px-[14px] py-[10px] rounded-[18px] max-w-[85%] break-words text-sm leading-[1.4] bg-[#e9ecef] text-[#333] rounded-bl-[4px] self-start">
                    Xin chào! Bạn cần tìm món ăn hay thắc mắc về công thức nào, cứ hỏi mình nhé!
                </div>
            )}

            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* BONG BÓNG TIN NHẮN */}
                <div 
                  className={`px-[14px] py-[10px] rounded-[18px] max-w-[85%] break-words text-sm leading-[1.4] 
                  ${m.from === 'user' 
                    ? 'bg-orange-400 text-white rounded-br-[4px]' 
                    : 'bg-[#e9ecef] text-[#333] rounded-bl-[4px]'}`}
                >
                  {m.text?.replace(/\*\*/g, '')} 
                </div>
                
                {/* DANH SÁCH MÓN ĂN GỢI Ý (Nếu có) */}
                {m.recipeData && m.recipeData.length > 0 && (
                  <div className="flex flex-col gap-2.5 mt-2 w-[95%]">
                    {m.recipeData.map((recipe, idx) => (
                      // Khung thẻ món ăn: Thêm group để quản lý hover, tạo bóng đổ mềm và hiệu ứng nảy nhẹ
                      <div 
                        key={idx} 
                        onClick={() => handleRecipeClick(recipe.recipe_id || recipe.article_id || recipe.dish_id)}
                        className="group flex items-center bg-white border border-transparent rounded-[14px] p-2 cursor-pointer transition-all duration-300 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(255,71,87,0.15)] hover:border-[#ff4757]/30 hover:-translate-y-0.5"
                      >
                        {/* Hình ảnh: Bọc trong div relative để chặn overflow nếu cần, thêm hiệu ứng zoom nhẹ khi hover */}
                        <div className="relative shrink-0 overflow-hidden rounded-xl shadow-sm">
                            <img 
                              src={recipe.cover_image ? getRecipeImageUrl(recipe.recipe_id || recipe.article_id, recipe.cover_image) : (recipe.image_url || '/default-recipe.jpg')} 
                              alt={recipe.title || recipe.original_name} 
                              className="w-12 h-12 object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        
                        {/* Nội dung: Tiêu đề và Tag thời gian */}
                        <div className="flex flex-col justify-center ml-3 flex-1 min-w-0">
                          <p className="m-0 text-[13px] font-extrabold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#ff4757] transition-colors">
                            {recipe.title || recipe.original_name}
                          </p>
                          
                          {recipe.cook_time && (
                            <div className="mt-1.5 flex items-center">
                                <span className="inline-flex items-center gap-1 bg-[#fff0f0] text-[#ff4757] text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  ⏱ {Math.floor(recipe.cook_time)} phút
                                </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="px-[14px] py-[10px] rounded-[18px] max-w-[85%] break-words text-sm leading-[1.4] bg-[#e9ecef] text-[#333] rounded-bl-[4px] self-start animate-pulse">
                Đang suy nghĩ...
              </div>
            )}
          </div>

          {/* CÂU HỎI GỢI Ý */}
          {messages.length <= 0 && (
            <div className="p-[10px] flex flex-wrap gap-2 bg-white border-t border-[#eee]">
              {quicks.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(q)}
                  className="bg-yellow-100 border border-orange-500 px-3 py-1.5 rounded-full text-xs text-orange-500 cursor-pointer transition-colors duration-200 hover:bg-yellow-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* THANH NHẬP LIỆU */}
          <div className="flex p-3 bg-white border-t border-[#eee]">
            <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(input); }} 
                placeholder="Gõ câu hỏi của bạn..." 
                className="flex-1 px-[15px] py-[10px] border border-[#ddd] rounded-full outline-none text-sm transition-colors focus:border-[#ff4757]"
            />
            <button 
              onClick={() => sendMessage(input)}
              className="bg-orange-400 text-white border-none px-5 ml-2 rounded-full font-bold cursor-pointer transition-colors hover:bg-[#e63c4b]"
            >
              Gửi
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Chatbot;