import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

import InteractivePanel from './components/InteractivePanel';
import ChatHistoryModal from './components/ChatHistoryModal';
import ApiKeyModal from './components/ApiKeyModal';
import ApiKeySettingsModal from './components/ApiKeySettingsModal';
import InputBar from './components/InputBar';
import SilhouetteCharacter from './components/SilhouetteCharacter';
import TransferModal, { TransferStep } from './components/TransferModal';
import Header from './components/Header';
import DebugOverlay from './components/DebugOverlay';
import ThinkingAnimation from './components/ThinkingAnimation';
import TransactionsModal from './components/TransactionsModal';

import { useAppAssets } from './hooks/useAppAssets';
import { useAudioPlayback } from './hooks/useAudioPlayback';
import { useLiveSession } from './hooks/useLiveSession';
import { useTranslation } from './i18n/LanguageContext';

import {AppState, ChatMessage, CompanionId, InteractionMode, SessionStatus} from './types';
import { featureMap, features as allFeatures } from './data/features';
import { transactionsData } from './data/transactions';
import {useOpenAIRealtimeSession} from "./hooks/useOpenAIRealtimeSession";
import {createModerationGuardrail} from "./agents/guardrails.ts";
import {v4 as uuidv4} from "uuid";
import {useHandleSessionHistory} from "./hooks/useHandleSessionHistory.ts";
import {useTranscript} from "./contexts/TranscriptContext.tsx";
import {initialAgent} from "./agents";

export default function App() {
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DISCONNECTED');
    const handoffTriggerRef = useRef(false)
    const [statusText, setStatusText] = useState('');
    const [liveConversation, setLiveConversation] = useState<ChatMessage[]>([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isFeatureInfoOpen, setIsFeatureInfoOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
    const [isApiKeySettingsModalOpen, setIsApiKeySettingsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

    const [requireUserApiKey, setRequireUserApiKey] = useState(false);
    const [userApiKey, setUserApiKey] = useState('');

    const companionId: CompanionId = 'G';

    const [selectedFeature, setSelectedFeature] = useState<{name: string, description: string} | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    const [interactionMode, setInteractionMode] = useState<InteractionMode>(null);
    const [aiSuggestedTransfer, setAiSuggestedTransfer] = useState<{ recipientName: string; amount: number; accountNumber?: string; memo?: string; } | null>(null);
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [transferStep, setTransferStep] = useState<TransferStep>('input');

    // --- REFS ---
    const interactionModeRef = useRef(interactionMode);
    interactionModeRef.current = interactionMode;
    const isTransferModalOpenRef = useRef(isTransferModalOpen);
    isTransferModalOpenRef.current = isTransferModalOpen;
    const isTransactionsModalOpenRef = useRef(isTransactionsModalOpen);
    isTransactionsModalOpenRef.current = isTransactionsModalOpen;
    const characterRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const audioElementRef = useRef<HTMLAudioElement>(null);
    const audioLevelUpdaterRef = useRef<(level: number) => void>(() => {});
    const liveSessionActionsRef = useRef<{ start: (options: any) => Promise<void>; stop: () => Promise<void>; interrupt: () => void; mute: (m: boolean) => void; } | null>(null);
    const onPlaybackEndedRef = useRef<(() => void) | undefined>(undefined);

    // --- HOOKS ---
    const { t } = useTranslation();
    const imageUrls = useAppAssets();
    const {
        addTranscriptMessage,
    } = useTranscript();

    const companyName = "GIANTY"
    const guardrail = createModerationGuardrail(companyName)

    // Function to get ephemeral key from your backend
    const getEphemeralKey = useCallback(async (): Promise<string> => {
        try {
            const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: requireUserApiKey ? userApiKey : undefined
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ephemeral key request failed:', response.status, errorText);
                throw new Error(`Failed to get ephemeral key: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Expected JSON but got:', text.substring(0, 200));
                throw new Error('Backend endpoint returned non-JSON response. Make sure /api/ephemeral-key endpoint exists and returns JSON.');
            }

            const data = await response.json();

            if (!data.ephemeralKey) {
                console.error('Response missing ephemeralKey:', data);
                throw new Error('Backend response missing ephemeralKey field');
            }

            return data.ephemeralKey;
        } catch (error) {
            console.error('Error fetching ephemeral key:', error);
            throw error;
        }
    }, [requireUserApiKey, userApiKey]);

    // --- CORE CALLBACKS & STATE LOGIC ---
    const resetInteractionState = useCallback(() => {
        setAppState(AppState.IDLE);
        setLiveConversation([]);
        setInteractionMode(null);
        setStatusText('');
        if (characterRef.current) {
            characterRef.current.style.removeProperty('--glow-scale');
            characterRef.current.style.removeProperty('--aura-opacity');
        }
    }, []);

    // --- AUDIO PLAYBACK SETUP ---
    const handlePlaybackStateChange = useCallback((playing: boolean) => {
        if (playing) {
            setAppState(AppState.SPEAKING);
            if (interactionModeRef.current !== 'voice') {
                setStatusText(t('speaking'));
            }
        } else {
            onPlaybackEndedRef.current?.();
        }
    }, [t]);

    const { playAudio, queueAudioChunk, stopAllAudio } = useAudioPlayback(characterRef, handlePlaybackStateChange);

    useEffect(() => {
        onPlaybackEndedRef.current = () => {
            if (interactionModeRef.current === 'voice') {
                // In voice mode, transition is handled by session events
            } else {
                resetInteractionState();
            }
        };
    }, [resetInteractionState]);

    const handleToolCall = useCallback((name: string, args: any): ChatMessage | null => {
        console.log(`Tool call received: ${name}`, args);

        args = JSON.parse(args) || {};
        if (name === 'init_transfer_money' && args.to_account_name && args.to_account_number) {
            setAiSuggestedTransfer({
                recipientName: args.to_account_name,
                amount: args.amount,
                accountNumber: args.to_account_number,
                memo: args.description
            });
            setIsTransferModalOpen(true);
            setTransferStep('input');
            return null;
        } else if (name === 'continue_transfer_money') {
            if (isTransferModalOpenRef.current) {
                setTransferStep('confirm');
            }
            return null;
        } else if (name === 'confirm_transfer_money') {
            if (isTransferModalOpenRef.current) {
                setTransferStep('scanning');
            }
            return null;
        } else if (name === 'finish_transfer_money') {
            handleSuggestionHandled()
            if (isTransferModalOpenRef.current) {
                setIsTransferModalOpen(false);
                setTransferStep('input');
            }
            if (isTransactionsModalOpenRef.current) {
                setIsTransactionsModalOpen(false);
            }
            return null;
        } else if (name === 'viewTransactions') {
            if (isTransferModalOpenRef.current) {
                setIsTransferModalOpen(false);
                setTransferStep('input');
            }
            setIsTransactionsModalOpen(true);
            return null;
        } else if (name === 'cancel_transfer_money') {
            if (isTransferModalOpenRef.current) {
                setIsTransferModalOpen(false);
                setTransferStep('input');
            }
            if (isTransactionsModalOpenRef.current) {
                setIsTransactionsModalOpen(false);
            }
            return null;
        }

        return null;
    }, [t]);

    const handleToolCallEnd = useCallback((name: string, result: any): ChatMessage | null => {
        console.log(`Tool call received: ${name}`, result);

        result = JSON.parse(result) || {};
        if (name === 'init_transfer_money') {
            setAiSuggestedTransfer({
                recipientName: result.to_account_name,
                amount: result.amount,
                accountNumber: result.to_account_number,
                memo: result.description
            });
            setIsTransferModalOpen(true);
            setTransferStep('input');
            return null;
        }

        return null;
    }, [t]);

    const liveSessionCallbacks = useMemo(() => ({
        onConnecting: () => {
            setInteractionMode('voice');
            setAppState(AppState.THINKING);
            setStatusText(t('connecting'));
        },
        onConnected: () => {
            setStatusText(t('gIsReady'));
            // const greetingMessage: ChatMessage = { role: 'model', text: t('welcomeGreeting') };
            // setLiveConversation(prev => [...prev, greetingMessage]);
            updateSession(true)
        },
        onListening: () => {
            setAppState(AppState.LISTENING);
            setStatusText(t('listening'));
            setLiveConversation(prev => [...prev, { role: 'user', text: '' }]);
        },
        onSpeaking: () => {
            setAppState(AppState.SPEAKING);
            setStatusText(t('speaking'));
        },
        onOutputTranscriptionUpdate: (text: string) => {
            setLiveConversation(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'model') {
                    return [...prev.slice(0, -1), { ...lastMessage, text }];
                }
                return [...prev, { role: 'model', text }];
            });
        },
        onAudioChunk: queueAudioChunk,
        onInterrupt: stopAllAudio,
        onTurnComplete: (
            userInput: string,
            modelOutput: string,
            audioChunks: string[],
            userAudioBlob: globalThis.Blob | null,
            inputTokens?: number,
            outputTokens?: number
        ) => {
            const finalModelOutput = modelOutput.trim();

            setLiveConversation(prev => {
                const newConversation = [...prev];

                // Finalize model message
                let lastModelMessageIndex = -1;
                for (let i = newConversation.length - 1; i >= 0; i--) {
                    if (newConversation[i].role === 'model') {
                        lastModelMessageIndex = i;
                        break;
                    }
                }
                if (lastModelMessageIndex !== -1) {
                    newConversation[lastModelMessageIndex] = {
                        ...newConversation[lastModelMessageIndex],
                        text: finalModelOutput
                    };
                }

                // Finalize user message
                let lastUserMessageIndex = -1;
                for (let i = newConversation.length - 1; i >= 0; i--) {
                    if (newConversation[i].role === 'user') {
                        lastUserMessageIndex = i;
                        break;
                    }
                }
                if (lastUserMessageIndex !== -1 && newConversation[lastUserMessageIndex].text === '') {
                    newConversation[lastUserMessageIndex] = {
                        ...newConversation[lastUserMessageIndex],
                        text: userInput || t('voiceMessagePlaceholder')
                    };
                }
                return newConversation;
            });

            if (finalModelOutput || userInput) {
                setChatHistory(prev => [
                    ...prev,
                    {
                        role: 'user',
                        text: userInput || t('voiceMessagePlaceholder'),
                        audioUrl: userAudioBlob ? URL.createObjectURL(userAudioBlob) : undefined
                    },
                    {
                        role: 'model',
                        text: finalModelOutput,
                        audioBase64Chunks: audioChunks
                    }
                ]);
            }
        },
        onIdle: resetInteractionState,
        onError: (message: string) => {
            setStatusText(`${message} Please check your API key and network connection.`);
            resetInteractionState();
        },
        onInputAudioLevelUpdate: (level: number) => audioLevelUpdaterRef.current?.(level),
        onToolCall: (name: string, args: any) => {
            handleToolCall(name, args)
        },
        onToolCallEnd: (name: string, result: any) => {
            handleToolCallEnd(name, result)
        }
    }), [queueAudioChunk, stopAllAudio, t, resetInteractionState, handleToolCall]);

    const { start, stop, interrupt, mute, status, sendEvent } = useOpenAIRealtimeSession(initialAgent, companionId, liveSessionCallbacks);

    useEffect(() => {
        liveSessionActionsRef.current = { start, stop, interrupt, mute };
        setSessionStatus(status)
    }, [start, stop, interrupt, mute, status]);

    // --- LIFECYCLE & SETUP ---
    useEffect(() => {
        const savedSetting = localStorage.getItem('require_user_api_key');
        const shouldUsePersonalKey = savedSetting === 'true';
        setRequireUserApiKey(shouldUsePersonalKey);
        const storedUserKey = localStorage.getItem('user_api_key') || '';
        setUserApiKey(storedUserKey);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'e') {
                event.preventDefault();
                setIsDebugMode(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Create audio element for OpenAI WebRTC
    // useEffect(() => {
    //     if (!audioElementRef.current) {
    //         const audio = new Audio();
    //         audio.autoplay = true;
    //         audioElementRef.current = audio;
    //     }
    // }, []);

    const sdkAudioElement = React.useMemo(() => {
        if (typeof window === 'undefined') return undefined;
        const el = document.createElement('audio');
        el.autoplay = true;
        el.style.display = 'none';
        document.body.appendChild(el);
        return el;
    }, []);

    useEffect(() => {
        if (sdkAudioElement && !audioElementRef.current) {
            audioElementRef.current = sdkAudioElement;
        }
    }, [sdkAudioElement]);

    // --- INTERACTION HANDLERS ---
    const checkApiKey = useCallback(() => {
        if (requireUserApiKey && !userApiKey) {
            setStatusText(t('error_api_key_not_set'));
            setIsApiKeyModalOpen(true);
            return false;
        }
        return true;
    }, [requireUserApiKey, userApiKey, t]);

    const handleCloseInteraction = useCallback(async () => {
        stopAllAudio();
        await liveSessionActionsRef.current?.stop();
        resetInteractionState();
    }, [stopAllAudio, resetInteractionState]);

    const handleVoiceToggle = useCallback(async () => {
        if (interactionMode === 'voice') {
            await handleCloseInteraction();
        } else if (checkApiKey()) {
            try {
                await liveSessionActionsRef.current?.start({
                    getEphemeralKey,
                    audioElement: audioElementRef.current,
                    outputGuardrails: [guardrail]
                });
            } catch (error) {
                console.error('Failed to start voice session:', error);
                setStatusText(t('error_service_unavailable'));
            }
        }
    }, [interactionMode, checkApiKey, handleCloseInteraction, getEphemeralKey, t]);

    const handleFeatureClick = (featureKey: string) => {
        if (featureKey === 'api_key') {
            setIsApiKeySettingsModalOpen(true);
            return;
        }
        if (featureKey === 'transfer') {
            setIsTransferModalOpen(true);
            setTransferStep('input');
            return;
        }
        if (featureKey === 'statement') {
            setIsTransactionsModalOpen(true);
            return;
        }

        const feature = featureMap.get(featureKey);
        if (feature?.descriptionKey) {
            setSelectedFeature({
                name: t(feature.nameKey as any),
                description: t(feature.descriptionKey as any)
            });
            setIsFeatureInfoOpen(true);
        }
    };

    const handleQuickActionClick = (actionKey: string) => {
        if (actionKey === 'transfer') {
            setIsTransferModalOpen(true);
            setTransferStep('input');
        }
        if (actionKey === 'inquiry') {
            console.log('Inquiry action triggered');
        }
        if (actionKey === 'advice') {
            console.log('Advice action triggered');
        }
    };

    const handleSaveUserApiKey = (key: string) => {
        localStorage.setItem('user_api_key', key);
        setUserApiKey(key);
        setIsApiKeyModalOpen(false);
    };

    const handleApiKeySettingChange = (usePersonal: boolean) => {
        localStorage.setItem('require_user_api_key', String(usePersonal));
        setRequireUserApiKey(usePersonal);
    };

    const handleSuggestionHandled = useCallback(() => {
        setAiSuggestedTransfer(null);
    }, []);

    const handleViewTransactions = useCallback(() => {
        setIsTransferModalOpen(false);
        setTransferStep('input');
        setIsTransactionsModalOpen(true);
    }, []);

    useHandleSessionHistory()
    const sendSimulatedUserMessage = (text: string) => {
        const id = uuidv4().slice(0, 32)
        addTranscriptMessage(id, "user", text, true)

        sendEvent({
            type: 'conversation.item.create',
            item: {
                id,
                type: 'message',
                role: 'user',
                content: [{ type: 'input_text', text }],
            },
        })
        sendEvent({ type: 'response.create' });
    }

    const updateSession = (shouldTriggerResponse: boolean) => {
        sendEvent({
            type: 'session.update',
            session: {
                type: 'realtime',
            }
        })

        if (shouldTriggerResponse) {
            sendSimulatedUserMessage('hi')
        }
        return
    }

    // useEffect(() => {
    //     if (sessionStatus === 'CONNECTED') {
    //         console.log("Update session")
    //         updateSession(!handoffTriggerRef.current)
    //         handoffTriggerRef.current = false
    //     }
    // }, [sessionStatus]);

    // --- DERIVED STATE FOR LAYOUT CONTROL ---
    const isInteractionActive = useMemo(() => interactionMode !== null, [interactionMode]);
    const isConnecting = useMemo(() =>
            appState === AppState.THINKING && interactionMode === 'voice',
        [appState, interactionMode]
    );
    const isChatLayout = useMemo(() =>
            isInteractionActive && !isConnecting,
        [isInteractionActive, isConnecting]
    );
    const showChat = useMemo(() => liveConversation.length > 0, [liveConversation]);

    const setAudioLevelUpdater = useCallback((updater: (level: number) => void) => {
        audioLevelUpdaterRef.current = updater;
    }, []);

    // --- RENDER ---
    return (
        <div id="app-container" className="relative w-full h-full max-h-screen aspect-[9/16] overflow-hidden bg-gray-100 shadow-2xl shadow-black/20 flex flex-col">
            <style>{`
        :root { --accent-primary: #06b6d4; --accent-glow: hsla(190, 95%, 48%, 0.7); --accent-active: #BE123C; --glow-scale: 1; --aura-opacity: 0; }
        .text-glow { text-shadow: 0 0 8px var(--accent-glow), 0 0 10px var(--accent-glow); }
        .icon-glow { filter: drop-shadow(0 0 5px var(--accent-glow)); }
        @keyframes speaking-sway { 0%, 100% { transform: rotate(-1deg) scale(var(--glow-scale)); } 50% { transform: rotate(1deg) scale(var(--glow-scale)); } }
        @keyframes idle-breathe { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.02) translateY(-4px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

            {isDebugMode && <DebugOverlay />}

            <Header onSearchClick={() => inputRef.current?.focus()} />
            <main id="app-main" className="relative z-10 flex flex-col flex-grow h-full overflow-hidden">
                <div className={`relative transition-all duration-500 ${isChatLayout ? 'h-48' : 'flex-grow'}`}>
                    <div id="character-container" className="absolute inset-0 flex items-center justify-center">
                        {appState === AppState.THINKING && <ThinkingAnimation />}
                        <SilhouetteCharacter
                            appState={appState}
                            imageUrl={imageUrls.G}
                            characterRef={characterRef}
                            interactionMode={interactionMode}
                        />
                    </div>
                </div>
                <footer className={`relative z-20 flex flex-col ${isChatLayout ? 'flex-grow' : 'flex-shrink-0'}`}>
                    <div className="w-full text-center px-6 pb-1">
                        <h2 id="status-text" className="text-xs font-medium text-gray-600 h-5 flex justify-center items-center">
                            <span>{statusText}</span>
                        </h2>
                    </div>
                    <div id="interactive-panel-container" className={`w-full px-2 mb-2 transition-all duration-500 relative ${!isConnecting && showChat ? 'flex-grow' : 'h-28'} ${isConnecting ? 'hidden' : ''}`}>
                        <InteractivePanel
                            appState={appState}
                            interactionMode={interactionMode}
                            liveConversation={liveConversation}
                            onQuickActionClick={handleQuickActionClick}
                            onActionClick={handleFeatureClick}
                            aiAvatarUrl={imageUrls.G_avatar}
                            userAvatarUrl={imageUrls.user_avatar}
                            setAudioLevelUpdater={setAudioLevelUpdater}
                        />
                    </div>
                    <InputBar
                        inputRef={inputRef}
                        onVoiceToggle={handleVoiceToggle}
                        onHistoryClick={() => setIsHistoryOpen(true)}
                        appState={appState}
                        interactionMode={interactionMode}
                    />
                </footer>
            </main>

            <ChatHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={chatHistory}
                aiAvatarUrl={imageUrls.G_avatar}
                userAvatarUrl={imageUrls.user_avatar}
            />

            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => setIsApiKeyModalOpen(false)}
                onSave={handleSaveUserApiKey}
                currentKey={userApiKey}
            />

            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => {
                    setIsTransferModalOpen(false);
                    setTransferStep('input');
                }}
                suggestedTransfer={aiSuggestedTransfer}
                onSuggestionHandled={handleSuggestionHandled}
                step={transferStep}
                onStepChange={setTransferStep}
                onViewTransactions={handleViewTransactions}
            />

            <ApiKeySettingsModal
                isOpen={isApiKeySettingsModalOpen}
                onClose={() => setIsApiKeySettingsModalOpen(false)}
                currentSetting={requireUserApiKey}
                onSettingChange={handleApiKeySettingChange}
                onManagePersonalKey={() => {
                    setIsApiKeySettingsModalOpen(false);
                    setIsApiKeyModalOpen(true);
                }}
            />

            <TransactionsModal
                isOpen={isTransactionsModalOpen}
                onClose={() => setIsTransactionsModalOpen(false)}
                transactions={transactionsData}
            />
        </div>
    );
}