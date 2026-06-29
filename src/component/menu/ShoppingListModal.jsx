import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Check, Beef, Carrot, UtensilsCrossed, Wheat, PackageOpen } from 'lucide-react';
import { useShoppingListQuery } from '../../hooks/queries/useMenuQueries';

const CATEGORY_MAP = {
    meat: { label: 'Thịt & Hải sản', icon: <Beef className="w-5 h-5 text-rose-500" /> },
    vegetable: { label: 'Rau củ & Trái cây', icon: <Carrot className="w-5 h-5 text-emerald-500" /> },
    spice: { label: 'Gia vị', icon: <UtensilsCrossed className="w-5 h-5 text-amber-500" /> },
    dry: { label: 'Đồ khô', icon: <Wheat className="w-5 h-5 text-amber-700" /> },
    others: { label: 'Khác', icon: <PackageOpen className="w-5 h-5 text-slate-500" /> }
};

export default function ShoppingListModal({ isOpen, onClose, menuId }) {
    const { data: listData, isLoading } = useShoppingListQuery(menuId);
    
    const [checkedItems, setCheckedItems] = useState(new Set());

    useEffect(() => {
        if (isOpen) setCheckedItems(new Set());
    }, [isOpen, menuId]);

    const toggleCheck = (itemId) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(itemId)) newChecked.delete(itemId);
        else newChecked.add(itemId);
        setCheckedItems(newChecked);
    };

    if (!isOpen) return null;

    const calculateProgress = () => {
        if (!listData) return 0;
        let total = 0;
        let checked = checkedItems.size;
        Object.values(listData).forEach(items => total += items.length);
        return total === 0 ? 0 : Math.round((checked / total) * 100);
    };

    const progress = calculateProgress();

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-t-[32px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col overflow-hidden border border-white/20 transform transition-all sm:animate-in sm:zoom-in-95 slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-300">
                
                <div className="p-6 border-b border-orange-100 flex flex-col gap-4 bg-gradient-to-r from-orange-50 to-amber-50 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#ff6b35] to-amber-500 flex items-center justify-center shadow-md shadow-orange-200">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Giỏ đi chợ</h2>
                                <p className="text-sm font-semibold text-[#ff6b35] mt-0.5">Cho thực đơn hiện tại</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 bg-white/50 hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-slate-200">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!isLoading && listData && Object.keys(listData).length > 0 && (
                        <div className="relative z-10 mt-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 px-1">
                                <span>Đã mua {checkedItems.size} món</span>
                                <span className={progress === 100 ? 'text-emerald-500' : 'text-[#ff6b35]'}>{progress}%</span>
                            </div>
                            <div className="w-full bg-orange-200/50 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#ff6b35] to-amber-500'}`} 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-[#ff6b35]"></div>
                            <p className="font-semibold text-slate-400 animate-pulse">Đang gom nguyên liệu...</p>
                        </div>
                    ) : !listData || Object.keys(listData).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                <ShoppingCart className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Giỏ hàng trống!</h3>
                            <p className="text-slate-500 font-medium max-w-sm">Có vẻ thực đơn của bạn chưa có món ăn nào, hoặc các món chưa có dữ liệu nguyên liệu.</p>
                        </div>
                    ) : (
                        <div className="space-y-5 pb-10">
                            {Object.entries(listData).map(([category, items]) => {
                                const catInfo = CATEGORY_MAP[category] || CATEGORY_MAP.others;
                                
                                return (
                                <div key={category} className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="flex items-center gap-2 bg-slate-50/50 px-5 py-3 border-b border-slate-100">
                                        <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                                            {catInfo.icon}
                                        </div>
                                        <h3 className="font-extrabold text-slate-700 text-[15px]">
                                            {catInfo.label}
                                        </h3>
                                        <span className="ml-auto bg-slate-200 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {items.length}
                                        </span>
                                    </div>
                                    <div className="p-2">
                                        {items.map((item, index) => {
                                            const itemId = `${category}-${index}`;
                                            const isChecked = checkedItems.has(itemId);
                                            
                                            return (
                                                <div 
                                                    key={itemId}
                                                    onClick={() => toggleCheck(itemId)}
                                                    className={`group flex items-center justify-between p-3 rounded-[16px] cursor-pointer transition-all duration-200 mb-1 last:mb-0 ${
                                                        isChecked 
                                                        ? 'bg-slate-50 opacity-60' 
                                                        : 'bg-white hover:bg-orange-50/50 active:bg-orange-100/50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3.5">
                                                        {/* Checkbox custom */}
                                                        <div className={`w-6 h-6 rounded-[8px] flex items-center justify-center border-2 transition-all duration-200 shrink-0 ${
                                                            isChecked 
                                                            ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200' 
                                                            : 'bg-white border-slate-300 group-hover:border-[#ff6b35]'
                                                        }`}>
                                                            {isChecked && <Check className="w-4 h-4 text-white" strokeWidth={3.5} />}
                                                        </div>
                                                        <span className={`font-bold text-[15px] transition-all ${isChecked ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-[#ff6b35]'}`}>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <div className={`px-3 py-1.5 rounded-xl font-extrabold text-sm transition-all ${
                                                        isChecked 
                                                        ? 'bg-slate-100 text-slate-400' 
                                                        : 'bg-orange-50 text-[#ff6b35] group-hover:bg-[#ff6b35] group-hover:text-white'
                                                    }`}>
                                                        {item.quantity} <span className="text-xs font-semibold opacity-80 uppercase tracking-wide ml-0.5">{item.unit}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}