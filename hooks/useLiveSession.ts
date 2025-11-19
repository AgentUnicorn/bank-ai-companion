
import { useRef, useCallback } from 'react';
// The Blob type for media content is defined locally as it is not exported by the SDK.
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, UsageMetadata } from '@google/genai';
import { encode } from '../utils/audioUtils';
import { CompanionId } from '../types';
import { systemInstruction } from '../data/systemPrompt';

// This interface defines the structure for media blobs sent to the Gemini API.
interface MediaBlob {
    data: string;
    mimeType: string;
}

interface LiveSessionCallbacks {
    onConnecting: () => void;
    onConnected: () => void;
    onListening: () => void;
    onSpeaking: () => void;
    onOutputTranscriptionUpdate: (text: string) => void;
    onAudioChunk: (base64Chunk: string) => Promise<void>;
    onInterrupt: () => void;
    onTurnComplete: (userInput: string, modelOutput: string, modelAudioChunks: string[], userAudioBlob: globalThis.Blob | null, inputTokens?: number, outputTokens?: number) => void;
    onIdle: () => void;
    onError: (message: string) => void;
    onInputAudioLevelUpdate: (level: number) => void;
    onToolCall: (name: string, args: any) => void;
}

const transferMoney: FunctionDeclaration = {
    name: 'transferMoney',
    description: "Initiates a money transfer. Use this when the user explicitly asks to send money. Capture the recipient's name, the amount, and optionally the recipient's account number and a memo.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            recipientName: {
                type: Type.STRING,
                description: "The name of the person to send money to. Ask for clarification if unsure.",
            },
            amount: {
                type: Type.NUMBER,
                description: 'The amount of money to send.',
            },
            accountNumber: {
                type: Type.STRING,
                description: "The recipient's bank account number. This is optional."
            },
            memo: {
                type: Type.STRING,
                description: "A short note or memo for the transfer. This is optional."
            }
        },
        required: ['recipientName', 'amount'],
    },
};

const continueTransfer: FunctionDeclaration = {
    name: 'continueTransfer',
    description: "Confirms the initial transfer details and proceeds to the final confirmation screen. Use this after the user has reviewed the initial transfer details on the screen and said 'ok' or 'continue'.",
    parameters: {
        type: Type.OBJECT,
        properties: {},
        required: [],
    },
};

const confirmTransfer: FunctionDeclaration = {
    name: 'confirmTransfer',
    description: "Gives the final authorization for the money transfer, which will initiate the biometric security scan. Use this only after the user has seen the final confirmation summary and explicitly said 'confirm' or 'ok, transfer it'.",
    parameters: {
        type: Type.OBJECT,
        properties: {},
        required: [],
    },
};

const closeModal: FunctionDeclaration = {
    name: 'closeModal',
    description: "Closes the currently open modal window, such as the transfer success screen. Use this when the user says 'done', 'close', or 'close popup'.",
    parameters: {
        type: Type.OBJECT,
        properties: {},
        required: [],
    },
};

const viewTransactions: FunctionDeclaration = {
    name: 'viewTransactions',
    description: "Opens and displays the user's transaction history list. Use this when the user asks to see their transactions, statement, or history.",
    parameters: {
        type: Type.OBJECT,
        properties: {},
        required: [],
    },
};


export const useLiveSession = (ai: GoogleGenAI | null, companionId: CompanionId, callbacks: LiveSessionCallbacks) => {
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionIdRef = useRef(0);
    
    const currentOutputTranscriptionRef = useRef('');
    const currentTurnAudioChunksRef = useRef<string[]>([]);
    const isStoppingRef = useRef(false);
    const userAudioChunksRef = useRef<Int16Array[]>([]);
    const isSpeakingRef = useRef<boolean>(false); // State guard for speaking state

    const _createWavBlob = useCallback((): globalThis.Blob | null => {
        if (userAudioChunksRef.current.length === 0) return null;

        const totalLength = userAudioChunksRef.current.reduce((acc, val) => acc + val.length, 0);
        const combined = new Int16Array(totalLength);
        let offset = 0;
        for (const chunk of userAudioChunksRef.current) {
            combined.set(chunk, offset);
            offset += chunk.length;
        }
        
        const dataSize = combined.length * 2;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        const writeString = (view: DataView, offset: number, str: string) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };

        const sampleRate = 16000;
        const numChannels = 1;
        const bitsPerSample = 16;
        
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
        
        const dataAsBytes = new Uint8Array(combined.buffer);
        for (let i = 0; i < dataSize; i++) {
            view.setUint8(44 + i, dataAsBytes[i]);
        }

        return new Blob([view], { type: 'audio/wav' });
    }, []);

    const stop = useCallback(async () => {
        isStoppingRef.current = true;
        sessionIdRef.current = 0; // Invalidate current session immediately

        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
            sessionPromiseRef.current = null;
        }

        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }

        if (workletNodeRef.current) {
            workletNodeRef.current.port.onmessage = null;
            workletNodeRef.current.disconnect();
            workletNodeRef.current = null;
        }
        
        if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach(track => track.stop());
            micStreamRef.current = null;
        }
       
        if (inputAudioContextRef.current?.state !== 'closed') {
           await inputAudioContextRef.current?.close();
           inputAudioContextRef.current = null;
        }
        
        currentOutputTranscriptionRef.current = '';
        currentTurnAudioChunksRef.current = [];
        userAudioChunksRef.current = [];
        isSpeakingRef.current = false;

        callbacks.onIdle();
        setTimeout(() => isStoppingRef.current = false, 100); // Reset after a short delay
    }, [callbacks]);

    const startMicrophone = useCallback(() => {
        if (!inputAudioContextRef.current || !micStreamRef.current) {
            console.error("Audio context or mic stream not initialized before starting microphone.");
            callbacks.onError("Could not start microphone.");
            return;
        }
        if (sessionIdRef.current === 0) {
             console.log("Attempted to start microphone on an invalid session.");
             return;
        }

        callbacks.onListening();
        const audioCtx = inputAudioContextRef.current;
        const stream = micStreamRef.current;
        const currentSessionId = sessionIdRef.current;

        mediaStreamSourceRef.current = audioCtx.createMediaStreamSource(stream);
        const workletNode = new AudioWorkletNode(audioCtx, 'audio-processor');
        workletNodeRef.current = workletNode;

        workletNode.port.onmessage = (event) => {
            const { pcm: pcmInt16, volume } = event.data;
            
            callbacks.onInputAudioLevelUpdate(volume);
            userAudioChunksRef.current.push(pcmInt16);

                const pcmBlob: MediaBlob = {
                data: encode(new Uint8Array(pcmInt16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
            };

            sessionPromiseRef.current?.then((session) => {
                // Only send if the session is still the current one
                if (sessionIdRef.current === currentSessionId) {
                    session.sendRealtimeInput({ media: pcmBlob });
                }
            });
        };
        
        mediaStreamSourceRef.current.connect(workletNode);
        // We must connect the node to the destination to keep the audio graph running
        workletNode.connect(audioCtx.destination);

    }, [callbacks]);

    const start = useCallback(async () => {
        if (!ai || sessionPromiseRef.current) return;

        console.log('--- Starting Voice Session ---');

        userAudioChunksRef.current = [];
        isStoppingRef.current = false;
        isSpeakingRef.current = false; // Reset speaking flag for new session
        callbacks.onConnecting();

        try {
            if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        noiseSuppression: true,
                        echoCancellation: true,
                    },
                });
                micStreamRef.current = stream;
                
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const newAudioContext = new AudioContext({ sampleRate: 16000 });
                try {
                    const response = await fetch('/utils/audioProcessor.js');
                    if (!response.ok) {
                        throw new Error(`Failed to fetch audio processor: ${response.statusText}`);
                    }
                    const scriptText = await response.text();
                    const blob = new Blob([scriptText], { type: 'application/javascript' });
                    const blobUrl = URL.createObjectURL(blob);
                    await newAudioContext.audioWorklet.addModule(blobUrl);
                    URL.revokeObjectURL(blobUrl);
                } catch (e) {
                    console.error("Error adding AudioWorklet module", e);
                    callbacks.onError('Browser not supported or configuration error.');
                    return;
                }
                inputAudioContextRef.current = newAudioContext;
            }
            
            const voiceName = 'Zephyr';
            
            const currentSessionId = Date.now();
            sessionIdRef.current = currentSessionId;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        if (sessionIdRef.current !== currentSessionId) return;
                        callbacks.onConnected();
                    },
                    onmessage: async (message: LiveServerMessage) => {
                         if (sessionIdRef.current !== currentSessionId) return;

                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                callbacks.onToolCall(fc.name, fc.args);
                                sessionPromiseRef.current?.then((session) => {
                                    session.sendToolResponse({
                                        functionResponses: {
                                            id: fc.id,
                                            name: fc.name,
                                            response: { result: "ok, action performed by user" },
                                        }
                                    })
                                });
                            }
                        }

                        // Output transcription is additive.
                        if (message.serverContent?.outputTranscription) {
                            const textChunk = message.serverContent.outputTranscription.text.replace(/<noise>/g, '');
                            if (textChunk) {
                                currentOutputTranscriptionRef.current += textChunk;
                                callbacks.onOutputTranscriptionUpdate(currentOutputTranscriptionRef.current);
                            }
                        }
                        
                        // --- Handle other events ---
                        if (message.serverContent?.interrupted) {
                            callbacks.onInterrupt();
                        }
                        
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData && !isStoppingRef.current) {
                            if (!isSpeakingRef.current) {
                                isSpeakingRef.current = true;
                                callbacks.onSpeaking(); // Call only on the first audio chunk
                            }
                            currentTurnAudioChunksRef.current.push(audioData);
                            await callbacks.onAudioChunk(audioData);
                        }

                        if (message.serverContent?.turnComplete) {
                            const finalModelOutput = currentOutputTranscriptionRef.current;
                            const userAudioBlob = _createWavBlob();
                            // FIX: `usageMetadata` is a top-level property on the `LiveServerMessage` object, not on `serverContent`.
                            // The type definitions may be outdated, so we cast to access it.
                            const usageMetadata = (message as LiveServerMessage & { usageMetadata?: UsageMetadata }).usageMetadata;
                            
                            // Log to console for debugging
                            console.log('--- Conversation Turn Complete ---');
                            console.log('User Input:', '(voice only)');
                            console.log('Model Response:', finalModelOutput || '(no speech generated)');
                            console.log('Token Usage:', usageMetadata);
                            console.log('---------------------------------');

                            callbacks.onTurnComplete(
                                '', // User input is voice only, no transcription
                                finalModelOutput,
                                [...currentTurnAudioChunksRef.current],
                                userAudioBlob,
                                usageMetadata?.promptTokenCount,
                                // FIX: Cast usageMetadata to `any` to access `candidatesTokenCount`.
                                // The SDK's `UsageMetadata` type might be outdated or incorrect for this property.
                                (usageMetadata as any)?.candidatesTokenCount
                            );
                            currentOutputTranscriptionRef.current = '';
                            currentTurnAudioChunksRef.current = [];
                            userAudioChunksRef.current = [];
                            isSpeakingRef.current = false; // Reset for the next turn
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        if (sessionIdRef.current !== currentSessionId) {
                            console.log(`Error from old session (${currentSessionId}), ignoring.`);
                            return;
                        }
                        console.error('Live session error:', e);
                        callbacks.onError('Connection error.');
                        stop();
                    },
                    onclose: (e: CloseEvent) => {
                       if (sessionIdRef.current !== currentSessionId) {
                           console.log(`Close from old session (${currentSessionId}), ignoring.`);
                           return;
                       }

                       console.log(`Live session for turn ${currentSessionId} closed by server.`);
                       sessionPromiseRef.current = null;
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
                    systemInstruction: systemInstruction,
                    tools: [{ functionDeclarations: [transferMoney, continueTransfer, confirmTransfer, closeModal, viewTransactions] }],
                },
            });
        } catch (error) {
            console.error('Failed to start live session:', error);
            callbacks.onError('Could not access microphone.');
            stop();
        }
    }, [ai, callbacks, stop, companionId, _createWavBlob, startMicrophone]);
    
    return { start, stop, startMicrophone };
};
