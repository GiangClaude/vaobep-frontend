import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipeImageUrl } from '../../utils/imageHelper';
import { useChatbotUI } from '../../hooks/ui/chatbot/useChatbotUI';

function Chatbot() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { 
      open, toggleOpen, 
      input, setInput, 
      messages, loading, currentContext, quicks, 
      sendMessage, handleClearChat 
  } = useChatbotUI();

  const onClearChatClick = () => {
    setIsMenuOpen(false); 
    handleClearChat();   
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
    toggleOpen(); 
  };

return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <div 
        onClick={toggleOpen}
        className="w-[50px] h-[50px] bg-orange-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.2)] ml-auto transition-transform hover:scale-105"
      >
        {open ? (
          <span className="font-bold text-base">✕</span>
        ) : (
          <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img src="/assets/logo/2.png" alt="" className="w-[28px] h-[28px]"/>
          </div>
        )}
      </div>

      {open && (
        <div className="absolute bottom-[65px] right-0 w-[300px] h-[430px] bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
          
           <div className="bg-orange-400 text-white px-[12px] py-[10px] flex justify-between items-center text-sm font-bold relative">
            <span>Trợ lý Vào Bếp</span>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="bg-transparent border-none text-white flex items-center justify-center p-1 rounded transition-colors hover:bg-orange-500 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>

              {/* Popup Menu Option */}
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsMenuOpen(false)}
                  ></div>

                  <div className="absolute right-0 top-[120%] mt-1 w-40 bg-white rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.15)] z-50 overflow-hidden border border-gray-100 py-1">
                    <button 
                      onClick={onClearChatClick}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-500 flex items-center gap-2 hover:bg-red-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Xóa lịch sử
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* BANNER GHIM NGỮ CẢNH */}
          {currentContext && (
            <div className="bg-orange-50 text-[#ff6b35] text-[11px] font-medium text-center py-1.5 border-b border-orange-100 flex items-center justify-center gap-1 shadow-inner">
                <span>📍</span> Đang tham chiếu nội dung bài viết
            </div>
          )}

          {/* BODY: KHU VỰC CHAT */}
          <div className="flex-1 p-[12px] overflow-y-auto bg-[#f8f9fa] flex flex-col gap-2">
            {messages.length === 0 && (
                <div className="px-[12px] py-[8px] rounded-[16px] max-w-[85%] break-words text-[13px] leading-[1.4] bg-[#e9ecef] text-[#333] rounded-bl-[4px] self-start">
                    Xin chào! Bạn cần tìm món ăn hay thắc mắc về công thức nào, cứ hỏi mình nhé!
                </div>
            )}

            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`px-[12px] py-[8px] rounded-[16px] max-w-[85%] break-words text-[13px] leading-[1.4] 
                  ${m.from === 'user' 
                    ? 'bg-orange-400 text-white rounded-br-[4px]' 
                    : 'bg-[#e9ecef] text-[#333] rounded-bl-[4px]'}`}
                >
                  {m.text?.replace(/\*\*/g, '')} 
                </div>
                
                {/* DANH SÁCH MÓN ĂN GỢI Ý */}
                {m.recipeData && m.recipeData.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    {m.recipeData.map((recipe, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleRecipeClick(recipe.recipe_id || recipe.article_id || recipe.dish_id)}
                        className="group flex items-center bg-white border border-transparent rounded-[12px] p-1.5 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:border-orange-200"
                      >
                        <div className="relative shrink-0 overflow-hidden rounded-lg">
                            <img 
                              src={recipe.cover_image ? getRecipeImageUrl(recipe.recipe_id || recipe.article_id, recipe.cover_image) : (recipe.image_url || '/default-recipe.jpg')} 
                              alt={recipe.title || recipe.original_name} 
                              className="w-10 h-10 object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        
                        <div className="flex flex-col justify-center ml-2.5 flex-1 min-w-0">
                          <p className="m-0 text-[12px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-orange-500">
                            {recipe.title || recipe.original_name}
                          </p>
                          
                          {recipe.cook_time && (
                            <div className="mt-1 flex items-center">
                                <span className="inline-flex items-center gap-1 bg-[#fff0f0] text-orange-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
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
              <div className="px-[12px] py-[8px] rounded-[16px] max-w-[85%] text-[13px] bg-[#e9ecef] text-[#333] rounded-bl-[4px] self-start animate-pulse">
                Đang suy nghĩ...
              </div>
            )}
          </div>

          {/* CÂU HỎI GỢI Ý */}
          {messages.length <= 0 && (
            <div className="p-2 flex flex-wrap gap-1.5 bg-white border-t border-[#eee]">
              {quicks.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(q)}
                  className="bg-orange-50 border border-orange-300 px-2.5 py-1 rounded-full text-[11px] text-orange-600 cursor-pointer transition-colors hover:bg-orange-100"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* THANH NHẬP LIỆU */}
          <div className="flex p-2 bg-white border-t border-[#eee]">
            <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(input); }} 
                placeholder="Gõ câu hỏi..." 
                className="flex-1 px-3 py-1.5 border border-[#ddd] rounded-full outline-none text-[13px] focus:border-orange-400"
            />
            <button 
              onClick={() => sendMessage(input)}
              className="bg-orange-400 text-white border-none px-3 ml-1.5 rounded-full text-[13px] font-bold cursor-pointer transition-colors hover:bg-orange-500"
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