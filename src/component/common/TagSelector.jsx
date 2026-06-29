import { useState } from "react";
import { X, Plus, Tag as TagIcon } from "lucide-react";
import {useTagQueries} from "../../hooks/queries/useTagQueries";

export default function TagSelector({ selectedTags = [], onChange }) {
  const { tags: availableTags = [] } = useTagQueries();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag) => {
    if (!selectedTags.some(t => t.tag_id === tag.tag_id)) {
      onChange([...selectedTags, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  }; 

  const handleRemoveTag = (tagId) => {
    onChange(selectedTags.filter(t => t.tag_id !== tagId));
  };

  const filteredTags = Array.isArray(availableTags) 
    ? availableTags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.some(selected => selected.tag_id === tag.tag_id)
      )
    : [];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-[#ff6b35] transition-all">
            <TagIcon className="w-5 h-5 text-gray-400" />
            <input 
                type="text"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Tìm kiếm hoặc chọn thẻ..."
                className="flex-1 outline-none text-gray-700 bg-transparent"
            />
        </div>

        {showSuggestions && inputValue && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                {filteredTags.length > 0 ? (
                    filteredTags.map(tag => (
                        <button
                            type="button"
                            key={tag.tag_id}
                            onClick={() => handleAddTag(tag)}
                            className="w-full text-left px-4 py-3 hover:bg-[#fff9f0] hover:text-[#ff6b35] transition-colors flex justify-between items-center"
                        >
                            <span>{tag.name}</span>
                            <Plus className="w-4 h-4 opacity-50" />
                        </button>
                    ))
                ) : (
                    <div className="px-4 py-3 text-gray-400 italic text-sm">
                        Không tìm thấy thẻ phù hợp
                    </div>
                )}
            </div>
        )}
        
        {showSuggestions && (
            <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowSuggestions(false)} 
            />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
            <span key={tag.tag_id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-sm font-medium border border-[#ff6b35]/20">
                {tag.name}
                <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag.tag_id)} 
                    className="hover:text-red-500"
                >
                    <X className="w-3 h-3" />
                </button>
            </span>
        ))}
      </div>
    </div>
  );
}