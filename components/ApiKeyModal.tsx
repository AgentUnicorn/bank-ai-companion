
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';

// --- ICONS ---
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
    currentKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            setInputValue(currentKey);
        }
    }, [isOpen, currentKey]);

    if (!isOpen) {
        return null;
    }
    
    const handleSave = () => {
        onSave(inputValue);
    }

    return (
        <div 
            id="api-key-modal"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
            <div 
                id="api-key-modal-container"
                className="relative bg-white/80 backdrop-blur-2xl border border-gray-200 rounded-lg w-full max-w-lg flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                <header id="api-key-modal-header" className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">{t('apiKeyModalTitle')}</h2>
                    <button 
                        id="api-key-modal-close-button"
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors rounded-full"
                        aria-label="Close"            
                    >
                        <CloseIcon />
                    </button>
                </header>
                
                {/* --- CONTENT --- */}
                <div id="api-key-modal-content" className="p-6 space-y-4">
                    <input 
                        id="api-key-input"
                        type="password"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('apiKeyModalPlaceholder')}
                        className="w-full bg-gray-100 border border-gray-300 rounded-full py-3 px-5 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-400 transition-all"
                    />
                    <p className="text-xs text-gray-500 text-center px-4">{t('apiKeyModalInfo')}</p>
                </div>

                {/* --- FOOTER --- */}
                <footer id="api-key-modal-footer" className="flex-shrink-0 flex justify-end p-4 bg-gray-50 border-t border-gray-200">
                    <button
                        id="api-key-save-button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-cyan-400"
                    >
                        {t('apiKeyModalSaveButton')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ApiKeyModal;