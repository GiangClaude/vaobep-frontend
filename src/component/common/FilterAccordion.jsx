import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterAccordion = ({ 
    label, 
    isOpen, 
    onToggle, 
    activeCount = 0, 
    children 
}) => {
    return (
        <div className="border-b border-gray-50 last:border-0 pb-3 mb-2">
            <button 
                onClick={onToggle}
                className="flex items-center justify-between w-full py-2 px-1 hover:bg-gray-50 rounded-lg transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold transition-colors ${
                        activeCount > 0 ? 'text-[#ff6b35]' : 'text-gray-700 group-hover:text-[#ff6b35]'
                    }`}>
                        {label}
                    </span>
                    
                    {activeCount > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-[#ff6b35] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                        >
                            {activeCount}
                        </motion.span>
                    )}
                </div>
                
                <div className="text-gray-400 group-hover:text-[#ff6b35]">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            <div className="flex flex-wrap gap-2 mt-2 px-1">
                <AnimatePresence mode="popLayout">
                    {children}
                </AnimatePresence>
                
                {!isOpen && activeCount === 0 && (
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hidden text-[10px] text-gray-400 italic py-1"
                    >
                        Thu gọn
                    </motion.span>
                )}
            </div>
        </div>
    );
};

export default FilterAccordion;