

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { ChatMessage } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { StaticSoundWaveIcon } from './Icons';

// --- ICONS ---
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
);
const PauseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zm6.5 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" /></svg>
);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
);

interface ChatHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: ChatMessage[];
    aiAvatarUrl?: string;
    userAvatarUrl?: string;
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({ isOpen, onClose, history, aiAvatarUrl, userAvatarUrl }) => {
    const { t } = useTranslation();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [nowPlaying, setNowPlaying] = useState<number | null>(null);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const voiceMessagePlaceholderText = t('voiceMessagePlaceholder');

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);
    
    useEffect(() => {
        // Cleanup audio context when modal is closed
        return () => {
            currentSourceRef.current?.stop();
            audioCtxRef.current?.close();
            audioCtxRef.current = null;
        };
    }, []);

    const getAudioContext = useCallback(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    const handlePlayAudio = useCallback(async (message: ChatMessage, index: number) => {
        if (nowPlaying === index) {
            currentSourceRef.current?.stop();
            setNowPlaying(null);
            return;
        }
        
        const audioCtx = getAudioContext();
        
        const onEnded = () => {
            setNowPlaying(null);
            currentSourceRef.current = null;
        };

        try {
            let audioBuffer: AudioBuffer;

            if (message.audioUrl) {
                const response = await fetch(message.audioUrl);
                const arrayBuffer = await response.arrayBuffer();
                audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            } else if (message.audioBase64) {
                const audioBytes = decode(message.audioBase64);
                audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
            } else if (message.audioBase64Chunks) {
                // For chunked audio, we stream it without easy stopping.
                setNowPlaying(index);
                let startTime = audioCtx.currentTime;
                for (const chunk of message.audioBase64Chunks) {
                    const audioBytes = decode(chunk);
                    const chunkBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
                    const source = audioCtx.createBufferSource();
                    source.buffer = chunkBuffer;
                    source.connect(audioCtx.destination);
                    source.start(startTime);
                    startTime += chunkBuffer.duration;
                }
                setTimeout(onEnded, (startTime - audioCtx.currentTime) * 1000);
                return; // Exit early for chunked audio
            } else {
                return; // No audio to play
            }
            
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.addEventListener('ended', onEnded, { once: true });
            source.start();
            currentSourceRef.current = source;
            setNowPlaying(index);

        } catch (error) {
            console.error("Error playing audio from history:", error);
            onEnded();
        }
    }, [nowPlaying, getAudioContext]);

    const handleDownloadAudio = useCallback(async (message: ChatMessage, index: number) => {
        let blob: Blob;

        if (message.audioUrl) {
            const response = await fetch(message.audioUrl);
            blob = await response.blob();
        } else {
            let pcmData: Uint8Array;
            if (message.audioBase64) {
                pcmData = decode(message.audioBase64);
            } else if (message.audioBase64Chunks) {
                const chunks = message.audioBase64Chunks.map(chunk => decode(chunk));
                const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
                const combined = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    combined.set(chunk, offset);
                    offset += chunk.length;
                }
                pcmData = combined;
            } else {
                return; // No audio to download
            }
            
            // Create WAV header
            const writeString = (view: DataView, offset: number, str: string) => {
                for (let i = 0; i < str.length; i++) {
                    view.setUint8(offset + i, str.charCodeAt(i));
                }
            };

            const sampleRate = 24000;
            const numChannels = 1;
            const bitsPerSample = 16;
            const dataSize = pcmData.length;
            const buffer = new ArrayBuffer(44 + dataSize);
            const view = new DataView(buffer);
            
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + dataSize, true);
            writeString(view, 8, 'WAVE');
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true); // PCM
            view.setUint16(22, numChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // byteRate
            view.setUint16(32, numChannels * (bitsPerSample / 8), true); // blockAlign
            view.setUint16(34, bitsPerSample, true);
            writeString(view, 36, 'data');
            view.setUint32(40, dataSize, true);
            
            const pcmAsBytes = new Uint8Array(pcmData.buffer);
            for (let i = 0; i < dataSize; i++) {
                view.setUint8(44 + i, pcmAsBytes[i]);
            }
            blob = new Blob([view], { type: 'audio/wav' });
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${message.role}_message_${index + 1}.wav`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, []);


    if (!isOpen) {
        return null;
    }

    return (
        <div 
            id="chat-history-modal"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
            <style>{`
                #chat-history-log::-webkit-scrollbar {
                    width: 6px;
                }
                #chat-history-log::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                #chat-history-log::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }
                #chat-history-log::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0, 0, 0, 0.3);
                }
            `}</style>
            <div 
                id="chat-history-modal-container"
                className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg w-full max-w-lg h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                <header id="chat-history-modal-header" className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">{t('chatHistoryTitle')}</h2>
                    <button 
                        id="chat-history-modal-close-button"
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors rounded-full"
                        aria-label="Close history"            
                    >
                        <CloseIcon />
                    </button>
                </header>
                
                {/* --- CHAT LOG --- */}
                <div ref={chatContainerRef} id="chat-history-log" className="flex-grow overflow-y-auto p-4 space-y-6 bg-gray-50/50">
                    {history.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>{t('noHistory')}</p>
                        </div>
                    ) : (
                        history.map((message, index) => {
                            if (message.role === 'system') {
                                return (
                                    <div key={index} data-testid={`chat-message-${index}`} data-role="system" className="text-center text-xs text-gray-500 italic py-2">
                                        <p>{message.text}</p>
                                    </div>
                                );
                            }

                            const isUserMessage = message.role === 'user';
                            const isVoiceMessage = isUserMessage && message.text === voiceMessagePlaceholderText;

                            return (
                                <div key={index} data-testid={`chat-message-${index}`} data-role={message.role} className={`flex items-start gap-3 ${isUserMessage ? 'justify-end' : ''}`}>
                                    {message.role === 'model' && aiAvatarUrl && (
                                        <img src={aiAvatarUrl} alt="Assistant" className="w-8 h-8 rounded-full flex-shrink-0 opacity-90 object-cover" />
                                    )}
                                    <div className={`flex flex-col gap-2 max-w-[80%]`}>
                                        <div className={`rounded-lg ${
                                            isUserMessage 
                                                ? 'bg-cyan-500 text-white rounded-br-none' 
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                        } ${isVoiceMessage ? 'px-3 py-2' : 'p-3'}`}>
                                             {isVoiceMessage ? <StaticSoundWaveIcon /> : <p className="text-base">{message.text}</p>}
                                        </div>
                                        {(message.audioUrl || message.audioBase64 || message.audioBase64Chunks) && (
                                            <div className={`flex items-center gap-2 px-2 ${isUserMessage ? 'self-end' : ''}`}>
                                                <button 
                                                    id={`play-audio-button-${index}`}
                                                    data-testid={`play-audio-button-${index}`}
                                                    onClick={() => handlePlayAudio(message, index)}
                                                    className="p-1.5 bg-black/5 hover:bg-black/10 text-gray-600 rounded-full transition-colors"
                                                    aria-label={nowPlaying === index ? "Pause audio" : "Play audio"}
                                                >
                                                    {nowPlaying === index ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    id={`download-audio-button-${index}`}
                                                    data-testid={`download-audio-button-${index}`}
                                                    onClick={() => handleDownloadAudio(message, index)}
                                                    className="p-1.5 bg-black/5 hover:bg-black/10 text-gray-600 rounded-full transition-colors"
                                                    aria-label="Download audio"
                                                >
                                                    <DownloadIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {message.role === 'user' && userAvatarUrl && (
                                        <img src={userAvatarUrl} alt="User" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHistoryModal;