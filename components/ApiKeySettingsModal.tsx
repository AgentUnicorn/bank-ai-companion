
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

// --- ICONS ---
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);
const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);


interface ApiKeySettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSetting: boolean; // true for personal, false for system
    onSettingChange: (usePersonal: boolean) => void;
    onManagePersonalKey: () => void;
}

const ApiKeySettingsModal: React.FC<ApiKeySettingsModalProps> = ({ isOpen, onClose, currentSetting, onSettingChange, onManagePersonalKey }) => {
    const { t } = useTranslation();

    if (!isOpen) {
        return null;
    }

    const renderOption = (id: string, labelKey: string, descriptionKey: string, isSelected: boolean, onClick: () => void) => (
        <button
            id={id}
            onClick={onClick}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-300 bg-gray-100/50 hover:bg-gray-100'
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{t(labelKey as any)}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t(descriptionKey as any)}</p>
                </div>
                {isSelected && <CheckCircleIcon className="w-6 h-6 text-cyan-500 flex-shrink-0 ml-4" />}
            </div>
        </button>
    );

    return (
        <div
            id="api-key-settings-modal"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
            <div
                id="api-key-settings-modal-container"
                className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg w-full max-w-lg flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                <header id="api-key-settings-modal-header" className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">{t('apiKeySettingsTitle')}</h2>
                    <button
                        id="api-key-settings-modal-close-button"
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors rounded-full"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </header>

                {/* --- CONTENT --- */}
                <div id="api-key-settings-modal-content" className="p-6 space-y-4">
                    {renderOption('system-key-option', 'useSystemKey', 'useSystemKeyDescription', !currentSetting, () => onSettingChange(false))}
                    {renderOption('personal-key-option', 'usePersonalKey', 'usePersonalKeyDescription', currentSetting, () => onSettingChange(true))}
                
                    {currentSetting && (
                        <div id="personal-key-management-section" className="pt-4 space-y-4 border-t border-gray-200">
                            <div className="bg-yellow-400/20 border border-yellow-500/40 text-yellow-800 text-sm rounded-lg p-3 flex items-start gap-3">
                                <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" />
                                <p>
                                    {t('personalKeyUsageInfo')}{' '}
                                    <a 
                                        href="https://ai.google.dev/gemini-api/docs/billing" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="font-semibold underline hover:text-yellow-900"
                                    >
                                        {t('learnMoreLinkText')}
                                    </a>
                                </p>
                            </div>
                            <button
                                id="manage-personal-key-button"
                                onClick={onManagePersonalKey}
                                className="w-full px-6 py-3 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-400"
                            >
                                {t('managePersonalKeyButton')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApiKeySettingsModal;