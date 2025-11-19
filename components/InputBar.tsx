

import React from 'react';
import { AppState } from '../types';
import { SendIcon, MicrophoneIcon, PauseIcon, CloseIcon, HistoryIcon } from './Icons';
import { useTranslation } from '../i18n/LanguageContext';

type InteractionMode = 'voice' | 'text' | null;

interface InputBarProps {
  onVoiceToggle: () => void;
  onHistoryClick: () => void;
  appState: AppState;
  interactionMode: InteractionMode;
  inputRef?: React.Ref<HTMLInputElement>;
}

const InputBar: React.FC<InputBarProps> = ({
    onVoiceToggle, onHistoryClick, appState, interactionMode, inputRef
}) => {
  const { t } = useTranslation();
  
  // Input is disabled if the app is not in an idle state (i.e., listening, thinking, speaking).
  const isInputDisabled = appState !== AppState.IDLE;

  const renderRightButton = () => {
    // Determine the button's appearance and action based on the interaction mode.
    if (interactionMode === 'voice') {
      return (
        <button
          id="voice-toggle-button"
          type="button"
          onClick={onVoiceToggle}
          className="p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-rose-500 shadow-lg bg-rose-500 text-white animate-[pulse-ring_1.5s_infinite]"
          aria-label={t('stopInteraction')}
          style={{ '--pulse-color': 'rgba(225, 29, 72, 0.7)' } as React.CSSProperties}
        >
          <PauseIcon className="w-6 h-6" />
        </button>
      );
    }
    
    // Default state: Microphone button to start a voice call.
    return (
      <button
        id="voice-toggle-button"
        type="button"
        onClick={onVoiceToggle}
        className="p-3 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-400 shadow-sm bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 hover:border-gray-400"
        aria-label={t('startListening')}
      >
        <MicrophoneIcon className="w-6 h-6" />
      </button>
    );
  };

  return (
    <div id="input-bar" className="relative p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
       <style>{`
        @keyframes pulse-ring { 
            0% { box-shadow: 0 0 0 0 var(--pulse-color); } 
            70% { box-shadow: 0 0 0 10px rgba(225, 29, 72, 0); } 
            100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); } 
        }
      `}</style>
      <form id="input-form" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3">
         <button
            id="history-button"
            type="button"
            onClick={onHistoryClick}
            className="p-3 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-400 shadow-sm bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 hover:border-gray-400"
            aria-label={t('openChatHistory')}
          >
            <HistoryIcon className="w-6 h-6" />
        </button>
        <div className="relative flex-grow">
          <input
            id="text-input"
            ref={inputRef}
            type="text"
            value=""
            placeholder={t('startListening')}
            disabled
            className={`w-full bg-gray-200/80 border border-gray-300 rounded-full py-3 px-5 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-400 transition-all duration-300 disabled:opacity-80 cursor-not-allowed`}
          />
        </div>
        {renderRightButton()}
      </form>
    </div>
  );
};

export default InputBar;