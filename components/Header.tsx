import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const NotificationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

interface HeaderProps {
    onSearchClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
    const { t } = useTranslation();
    return (
        <header id="app-header" className="relative z-30 flex-shrink-0 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <button id="header-back-button" className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors" aria-label="Back">
                <BackIcon className="w-6 h-6" />
            </button>
            <h1 id="header-title" className="text-lg font-semibold text-gray-800 tracking-wide">
                {t('customerSupport')}
            </h1>
            <div className="flex items-center gap-1">
                <button id="header-search-button" onClick={onSearchClick} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors" aria-label="Search">
                    <SearchIcon className="w-6 h-6" />
                </button>
                <button id="header-notify-button" className="relative p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors" aria-label="Notifications">
                    <NotificationIcon className="w-5 h-5" />
                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-rose-500 ring-1 ring-white"></span>
                </button>
                <button id="header-home-button" className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors" aria-label="Home">
                    <HomeIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;