import React, { createContext, useContext, useState } from 'react';
import Modal from '../component/common/modal';
import ReportModalComponent from '../component/common/ReportModal';

const ModalContext = createContext();

export const useGlobalModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({ isOpen: false });
    
    const [reportConfig, setReportConfig] = useState({ isOpen: false, onSubmitAPI: null });
    const [reportLoading, setReportLoading] = useState(false);
    const [reportError, setReportError] = useState('');

    const showModal = (config) => setModalConfig({ ...config, isOpen: true });
    const hideModal = () => setModalConfig({ isOpen: false });

    const showReportModal = (onSubmitAPI) => {
        setReportError('');
        setReportConfig({ isOpen: true, onSubmitAPI });
    };
    const hideReportModal = () => setReportConfig({ isOpen: false });

    const handleReportSubmit = async (reason) => {
        setReportLoading(true);
        setReportError('');
        try {
            await reportConfig.onSubmitAPI(reason);
            hideReportModal();
            showModal({ title: 'Thành công', message: 'Cảm ơn bạn đã báo cáo.', type: 'success' });
        } catch (error) {
            setReportError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setReportLoading(false);
        }
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal, showReportModal }}>
            {children}
            
            <Modal 
                isOpen={modalConfig.isOpen} 
                onClose={hideModal} 
                {...modalConfig} 
            />
            <ReportModalComponent 
                isOpen={reportConfig.isOpen} 
                onClose={hideReportModal} 
                onSubmit={handleReportSubmit}
                loading={reportLoading}
                serverError={reportError}
            />
        </ModalContext.Provider>
    );
};