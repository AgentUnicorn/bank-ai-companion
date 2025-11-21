import {useRef, useCallback, useState, useEffect} from 'react';
import {
    RealtimeSession,
    RealtimeAgent,
    OpenAIRealtimeWebRTC,
} from '@openai/agents/realtime';
import { applyCodecPreferences } from '../utils/codecUtils';
import { CompanionId } from '../types';
import {useHandleSessionHistory} from "./useHandleSessionHistory.ts";
import {SessionStatus} from "../types";

interface LiveSessionCallbacks {
    onConnecting: () => void;
    onConnected: () => void;
    onListening: () => void;
    onSpeaking: () => void;
    onOutputTranscriptionUpdate: (text: string) => void;
    onAudioChunk: (base64Chunk: string) => Promise<void>;
    onInterrupt: () => void;
    onTurnComplete: (
        userInput: string,
        modelOutput: string,
        modelAudioChunks: string[],
        userAudioBlob: globalThis.Blob | null,
        inputTokens?: number,
        outputTokens?: number
    ) => void;
    onIdle: () => void;
    onError: (message: string) => void;
    onInputAudioLevelUpdate: (level: number) => void;
    onToolCall: (name: string, args: any) => void;
    onToolCallEnd: (name: string, result: any) => void;
}

interface ConnectOptions {
    getEphemeralKey: () => Promise<string>;
    audioElement?: HTMLAudioElement;
    extraContext?: Record<string, any>;
    outputGuardrails?: any[]
}

export const useOpenAIRealtimeSession = (
    initialAgent: RealtimeAgent,
    companionId: CompanionId,
    callbacks: LiveSessionCallbacks
) => {
    const sessionRef = useRef<RealtimeSession | null>(null);
    const [status, setStatus] = useState<SessionStatus>('DISCONNECTED');

    const currentOutputTranscriptionRef = useRef('');
    const currentTurnAudioChunksRef = useRef<string[]>([]);
    const isStoppingRef = useRef(false);
    const userAudioChunksRef = useRef<string[]>([]);
    const isSpeakingRef = useRef<boolean>(false);
    const isListeningRef = useRef<boolean>(false);

    const codecParamRef = useRef<string>(
        (typeof window !== 'undefined'
            ? (new URLSearchParams(window.location.search).get('codec') ?? 'opus')
            : 'opus').toLowerCase()
    );

    const applyCodec = useCallback(
        (pc: RTCPeerConnection) => applyCodecPreferences(pc, codecParamRef.current),
        []
    );

    const historyHandlers = useHandleSessionHistory().current

    const handleTransportEvent = (event: any) => {
        switch (event.type) {
            case 'conversation.item.input_audio_transcription.completed':
                historyHandlers.handleTranscriptionCompleted(event)
                if (event.transcript) {
                    userAudioChunksRef.current.push(event.transcript);
                }
                break;

            case 'response.audio_transcript.delta':
                historyHandlers.handleTranscriptionDelta(event)
                if (event.delta) {
                    currentOutputTranscriptionRef.current += event.delta;
                    callbacks.onOutputTranscriptionUpdate(currentOutputTranscriptionRef.current);
                }
                break;

            case 'response.audio_transcript.done':
                historyHandlers.handleTranscriptionCompleted(event)
                if (event.transcript) {
                    currentOutputTranscriptionRef.current = event.transcript;
                    callbacks.onOutputTranscriptionUpdate(currentOutputTranscriptionRef.current);
                }
                break;

            case 'response.audio.delta':
                if (event.delta && !isStoppingRef.current) {
                    if (!isSpeakingRef.current) {
                        isSpeakingRef.current = true;
                        updateStatus('SPEAKING');
                    }
                    currentTurnAudioChunksRef.current.push(event.delta);
                    callbacks.onAudioChunk(event.delta);
                }
                break;

            case 'response.audio.done':
                isSpeakingRef.current = false;
                updateStatus('LISTENING');
                break;

            case 'input_audio_buffer.speech_started':
                if (!isListeningRef.current) {
                    isListeningRef.current = true;
                    updateStatus('LISTENING');
                }
                break;

            case 'input_audio_buffer.speech_stopped':
                isListeningRef.current = false;
                break;

            case 'response.done':
                const finalModelOutput = currentOutputTranscriptionRef.current;
                const userInput = userAudioChunksRef.current.join(' ');

                callbacks.onTurnComplete(
                    userInput,
                    finalModelOutput,
                    [...currentTurnAudioChunksRef.current],
                    null, // OpenAI handles audio internally
                    event.usage?.input_tokens,
                    event.usage?.output_tokens
                );

                currentOutputTranscriptionRef.current = '';
                currentTurnAudioChunksRef.current = [];
                userAudioChunksRef.current = [];
                isSpeakingRef.current = false;
                break;

            case 'conversation.interrupted':
                callbacks.onInterrupt();
                break;
        }
    }

    const handleAgentHandoff = (item: any) => {
        const history = item.context.history;
        const lastMessage = history[history.length - 1];
        const agentName = lastMessage.name.split("transfer_to_")[1];
        console.log('Handoff agent name:', agentName)
        // callbacks.onAgentHandoff?.(agentName);
    };

    // useEffect(() => {
    //     if (sessionRef.current) {
    //        sessionRef.current.on('agent_handoff', handleAgentHandoff);
    //     }
    //
    //     sessionRef.current.on('transport_event', handleTransportEvent)
    // }, [sessionRef.current]);

    const updateStatus = useCallback((newStatus: SessionStatus) => {
        setStatus(newStatus);
        switch (newStatus) {
            case 'CONNECTING':
                callbacks.onConnecting();
                break;
            case 'CONNECTED':
                callbacks.onConnected();
                break;
            case 'LISTENING':
                callbacks.onListening();
                break;
            case 'SPEAKING':
                callbacks.onSpeaking();
                break;
            case 'DISCONNECTED':
                callbacks.onIdle();
                break;
            case 'ERROR':
                // Error callback handled separately
                break;
        }
    }, [callbacks]);

    const stop = useCallback(async () => {
        if (isStoppingRef.current) return;
        isStoppingRef.current = true;

        if (sessionRef.current) {
            try {
                sessionRef.current.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
            sessionRef.current = null;
        }

        currentOutputTranscriptionRef.current = '';
        currentTurnAudioChunksRef.current = [];
        userAudioChunksRef.current = [];
        isSpeakingRef.current = false;
        isListeningRef.current = false;

        // historyHandlers.handleResetTranscriptHistory()
        updateStatus('DISCONNECTED');
        setTimeout(() => isStoppingRef.current = false, 100);
    }, [updateStatus]);

    const start = useCallback(async (options: ConnectOptions) => {
        if (sessionRef.current || isStoppingRef.current) return;

        console.log('--- Starting Voice Session ---');

        userAudioChunksRef.current = [];
        isStoppingRef.current = false;
        isSpeakingRef.current = false;
        isListeningRef.current = false;

        updateStatus('CONNECTING');

        try {
            const ek = await options.getEphemeralKey();

            // Create the agent with tools
            const transport = new OpenAIRealtimeWebRTC({
                audioElement: options.audioElement,
                changePeerConnection: async (pc: RTCPeerConnection) => {
                    applyCodec(pc)
                    return pc
                }
            })

            sessionRef.current = new RealtimeSession(initialAgent, {
                transport,
                model: import.meta.env.VITE_OPENAI_REALTIME_MODEL,
                config: {
                    inputAudioTranscription: {
                        model: import.meta.env.VITE_OPENAI_TRANSCRIPT_MODEL,
                    }
                },
                outputGuardrails: options.outputGuardrails ?? [],
                context: options.extraContext ?? {},
            });

            // Set up event listeners
            sessionRef.current.on('error', (error: any) => {
                console.error('Live session error:', error);
                callbacks.onError('Connection error.');
                stop();
            });

            // Handle transcription updates
            sessionRef.current.on('transport_event', handleTransportEvent);

            sessionRef.current.on('history_added', historyHandlers.handleHistoryAdded)
            sessionRef.current.on('history_updated', historyHandlers.handleHistoryUpdated)
            sessionRef.current.on('guardrail_tripped', historyHandlers.handleGuardrailTripped)

            // Handle tool calls
            // sessionRef.current.on('agent_tool_start', historyHandlers.handleAgentToolStart)
            sessionRef.current.on('agent_tool_start', (details: any, agent: any, functionCall: any) => {
                const {name, args} = historyHandlers.handleAgentToolStart(details, agent, functionCall)

                if (name && args && args.length) {
                    callbacks.onToolCall(name, args)
                }
            })

            // sessionRef.current.on('agent_tool_end', historyHandlers.handleAgentToolEnd)
            sessionRef.current.on('agent_tool_end', (details: any, agent: any, functionCall: any, result: any) => {
                const {name, tool_call_result} = historyHandlers.handleAgentToolEnd(details, agent, functionCall, result)

                if (name && tool_call_result && tool_call_result.length) {
                    callbacks.onToolCallEnd(name, tool_call_result)
                }
            })

            await sessionRef.current.connect({ apiKey: ek });
            updateStatus('CONNECTED');
            updateStatus('LISTENING'); // Start listening after connection

        } catch (error) {
            console.error('Failed to start live session:', error);
            callbacks.onError('Could not access microphone or connect to service.');
            stop();
        }
    }, [callbacks, stop, updateStatus, applyCodec, companionId]);

    const assertConnected = () => {
        if (!sessionRef.current) throw new Error("RealtimeSession not connected")
    }

    const interrupt = useCallback(() => {
        sessionRef.current?.interrupt();
    }, []);

    const sendEvent = useCallback((event: any) => {
        sessionRef.current?.transport.sendEvent(event);
    }, [])

    const mute = useCallback((m: boolean) => {
        sessionRef.current?.mute(m);
    }, []);

    return {
        start,
        stop,
        interrupt,
        mute,
        sendEvent,
        status
    };
};