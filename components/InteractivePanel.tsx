import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import {AppState, ChatMessage, TranscriptItem} from '../types';
import { NagaIcon, StaticSoundWaveIcon, TransferIcon } from './Icons';
import {useTranscript} from "../contexts/TranscriptContext.tsx";
import ReactMarkdown from 'react-markdown';
import {tryParseJson} from "../utils/helper.ts";
import {AIStructureResponse} from "../types/aiMessage.ts";
import {ReservationSuccessCard} from "./AIMessageCard/ReservationSuccessCard.tsx";
import {BalanceCard} from "./AIMessageCard/BalanceCard.tsx";
import {TransferSuccessCard} from "./AIMessageCard/TransferSuccessCard.tsx";

type InteractionMode = 'voice' | 'text' | null;

interface InteractivePanelProps {
  appState: AppState;
  interactionMode: InteractionMode;
  liveConversation: ChatMessage[];
  onQuickActionClick: (actionKey: string) => void;
  onActionClick: (featureKey: string) => void;
  backgroundImageUrl?: string;
  chatBackgroundImageUrl?: string;
  aiAvatarUrl?: string;
  userAvatarUrl?: string;
  setAudioLevelUpdater: (updater: (level: number) => void) => void;
}

const QuickActionButton: React.FC<{ id: string, icon: React.FC<any>, label: string, onClick: () => void, 'data-testid'?: string }> = ({ id, icon: Icon, label, onClick, 'data-testid': testId }) => (
    <button
        id={id}
        onClick={onClick}
        data-testid={testId}
        className="group flex flex-col items-center justify-center p-2 space-y-2 w-full aspect-[4/3] bg-white/80 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
    >
        <div className="w-8 h-8 text-cyan-600 group-hover:text-cyan-500 transition-colors duration-300">
            <Icon />
        </div>
        <span className="text-sm font-semibold text-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
            {label}
        </span>
    </button>
);


const UserVoiceBubble: React.FC<{ audioLevel: number }> = ({ audioLevel }) => {
    const bars = [0.5, 0.8, 1, 0.7, 0.4]; // Aesthetic heights for the bars
    const sensitivity = 15; // How much the bars react to sound
    const smoothedLevel = Math.min(1, audioLevel * sensitivity);

    return (
        <div className={`p-3 rounded-lg text-white text-base bg-cyan-500 rounded-br-none flex items-center justify-center gap-1.5 h-[50px] w-40`}>
             {bars.map((bar, i) => {
                // Apply a sine wave modulation to make the animation more dynamic and less uniform
                const modulation = Math.sin(Date.now() / 200 + i * 0.5) * 0.8 + 0.8;
                const scaleY = Math.max(0.1, smoothedLevel * bar * modulation);
                return (
                    <div
                        key={i}
                        className="w-1.5 bg-cyan-200/80 rounded-full transition-transform duration-100"
                        style={{
                            height: '80%',
                            transform: `scaleY(${scaleY})`,
                            transformOrigin: 'bottom',
                        }}
                    />
                );
            })}
        </div>
    );
};


const InteractivePanel: React.FC<InteractivePanelProps> = ({ appState, interactionMode, liveConversation, onQuickActionClick, onActionClick, backgroundImageUrl, chatBackgroundImageUrl, aiAvatarUrl, userAvatarUrl, setAudioLevelUpdater }) => {
    const { t } = useTranslation();
    const {transcriptItems} = useTranscript()
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const showChat = interactionMode === 'voice' || liveConversation.length > 0;
    const voiceMessagePlaceholderText = t('voiceMessagePlaceholder');
    
    // Manage user audio level locally to prevent re-rendering the whole app.
    const [userInputAudioLevel, setUserInputAudioLevel] = useState(0);

    // Connect the local state setter to the parent component via the ref-based callback.
    useEffect(() => {
        setAudioLevelUpdater(setUserInputAudioLevel);
        return () => {
            // Clean up by providing a no-op function when the component unmounts.
            setAudioLevelUpdater(() => {});
        };
    }, [setAudioLevelUpdater]);

    // Reset audio level visualization when the interaction ends.
    useEffect(() => {
        if (interactionMode === null) {
            setUserInputAudioLevel(0);
        }
    }, [interactionMode]);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [liveConversation]);

    const getAIMessageCard = (type: string) => {
        switch (type) {
            case 'reservation_card':
                return ReservationSuccessCard
            case 'balance_card':
                return BalanceCard
            case 'transfer_success_card':
                return TransferSuccessCard
            case 'none':
            default:
                return null
        }
    }

    if (showChat) {
        return (
            <div 
                id="interactive-panel-live-chat"
                className="absolute inset-0 pt-4 px-4 flex flex-col bg-gray-50/80 rounded-lg"
            >
                 <style>{`
                    #interactive-panel-live-chat .chat-scroll-area::-webkit-scrollbar { width: 6px; }
                    #interactive-panel-live-chat .chat-scroll-area::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
                    #interactive-panel-live-chat .chat-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; }
                    #interactive-panel-live-chat .chat-scroll-area::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.3); }
                `}</style>
                <div ref={chatContainerRef} className="chat-scroll-area flex-grow overflow-y-auto space-y-4 pr-2 pb-4">
                    {transcriptItems
                        .sort((a, b) => a.createdAtMs - b.createdAtMs)
                        .map((item: TranscriptItem, index) => {

                            const {
                                itemId,
                                type,
                                role,
                                data,
                                expanded,
                                timestamp,
                                title = '',
                                isHidden,
                                guardrailResult
                            } = item

                            if (isHidden) return null

                            if (type === 'MESSAGE') {
                                const isBracketedMessage = title.startsWith("[") && title.endsWith("]");
                                const displayTitle = isBracketedMessage
                                    ? title.slice(1, -1)
                                    : title;
                                const isUser = role === 'user'
                                const isAssistant = role === 'assistant'

                                const isLastMessage = index === transcriptItems.length - 1;
                                // if (isAssistant) {
                                //     return (
                                //         <div key={itemId} data-testid={`chat-message-${itemId}`} data-role="system" className="text-center text-xs text-gray-500 italic py-2 animate-[fadeIn_0.3s]">
                                //             <p>{displayTitle}</p>
                                //         </div>
                                //     );
                                // }

                                if (isUser) {
                                    const isCurrentUserTurn = interactionMode === 'voice' && isLastMessage && title === '';
                                    const isVoiceMessage = !isCurrentUserTurn && title === voiceMessagePlaceholderText;
                                    return (
                                        <div key={itemId} id={`user-turn-${index}`} className="flex items-start gap-3 justify-end">
                                            <div className="flex flex-col gap-2 max-w-[80%]">
                                                {isCurrentUserTurn ? (
                                                    <UserVoiceBubble audioLevel={userInputAudioLevel} />
                                                ) : (
                                                    <div className={`rounded-lg text-white text-base bg-cyan-500 rounded-br-none ${isVoiceMessage ? 'px-3 py-2' : 'p-3'}`}>
                                                        {isVoiceMessage ? (
                                                            <StaticSoundWaveIcon />
                                                        ) : (
                                                            <p>{displayTitle}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {userAvatarUrl && <img src={userAvatarUrl} alt="User" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />}
                                        </div>
                                    );
                                }

                                if (isAssistant) {
                                    return (
                                        <div key={itemId} id={`model-turn-${itemId}`} className="flex items-start gap-3">
                                            {aiAvatarUrl ?
                                                <img src={aiAvatarUrl} alt="Assistant" className="w-8 h-8 rounded-full flex-shrink-0 opacity-90 object-cover" />
                                                : <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center"><NagaIcon className="text-gray-500" /></div>
                                            }
                                            <div className="flex flex-col gap-2 max-w-[80%]">
                                                <div className="p-3 rounded-lg text-gray-800 text-base bg-white shadow-sm rounded-bl-none">
                                                    <div className={`whitespace-pre-wrap`}>
                                                        <ReactMarkdown>{displayTitle}</ReactMarkdown>
                                                    </div>
                                                </div>
                                                {/*{message.action && (*/}
                                                {/*    <button*/}
                                                {/*        id={`action-button-${message.action.key}`}*/}
                                                {/*        onClick={() => onActionClick(message.action!.key)}*/}
                                                {/*        className="self-start mt-1 px-4 py-1.5 bg-cyan-500 text-white font-semibold text-sm rounded-full hover:bg-cyan-600 transition-colors"*/}
                                                {/*    >*/}
                                                {/*        {message.action.text}*/}
                                                {/*    </button>*/}
                                                {/*)}*/}
                                            </div>
                                        </div>
                                    );
                                }
                            } else if (type === 'BREADCRUMB') {
                                if (data.success && data.ui && data.ui !== 'none') {
                                    const AiMessageCard = getAIMessageCard(data.ui.type)

                                    return (
                                        <div key={itemId} className="flex items-start gap-3">
                                            {aiAvatarUrl ? (
                                                <img src={aiAvatarUrl} alt="Nova" className="w-8 h-8 rounded-full flex-shrink-0 opacity-90 object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <NagaIcon className="text-gray-500" />
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-2 max-w-[80%]">
                                                {AiMessageCard && (
                                                   <AiMessageCard data={data.ui.data} />
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                            }
                    })}
                </div>
            </div>
        )
    }

    return (
        <div 
            id="interactive-panel-idle"
            className="w-full h-full flex items-center justify-center px-4"
        >
            <div className="w-full max-w-xs flex justify-center gap-4">
                <div className="w-1/3 max-w-[100px]">
                    <QuickActionButton 
                        id="quick-action-transfer"
                        icon={TransferIcon} 
                        label={t('quickAction_transfer')}
                        onClick={() => onQuickActionClick('transfer')} 
                        data-testid="quick-action-transfer"
                    />
                </div>
            </div>
        </div>
    );
};

export default InteractivePanel;