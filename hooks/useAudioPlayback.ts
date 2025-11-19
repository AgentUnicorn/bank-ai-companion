// FIX: Import React to fix "Cannot find namespace 'React'" error.
import React, { useRef, useCallback, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';

export const useAudioPlayback = (
  characterRef: React.RefObject<HTMLImageElement>,
  onPlaybackStateChange: (isPlaying: boolean) => void
) => {
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  // For single, complete audio file playback
  const activeSingleSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // For queued, streamed audio playback
  const activeStreamSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const isStreamPlayingRef = useRef<boolean>(false);

  const getAudioContext = useCallback(() => {
    if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
            analyserNodeRef.current = outputAudioContextRef.current.createAnalyser();
            analyserNodeRef.current.fftSize = 32;
        }
    }
    if (outputAudioContextRef.current?.state === 'suspended') {
        outputAudioContextRef.current.resume();
    }
    return outputAudioContextRef.current;
  }, []);

  useEffect(() => {
    getAudioContext(); // Initialize on mount
    return () => {
      outputAudioContextRef.current?.close();
    };
  }, [getAudioContext]);

  const stopVisualization = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (characterRef.current) {
      characterRef.current.style.removeProperty('--glow-scale');
      characterRef.current.style.removeProperty('--aura-opacity');
    }
  }, [characterRef]);

  const visualizeAudio = useCallback(() => {
    const audioCtx = getAudioContext();
    if (!analyserNodeRef.current || !characterRef.current || !audioCtx) return;
    
    const analyser = analyserNodeRef.current;
    analyser.connect(audioCtx.destination);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameIdRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const avg = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      const scale = 1 + (avg / 255) * 0.03;
      const opacity = 0.5 + (avg / 255) * 0.5;

      if (characterRef.current) {
        characterRef.current.style.setProperty('--glow-scale', `${scale}`);
        characterRef.current.style.setProperty('--aura-opacity', `${opacity}`);
      }
    };
    draw();
  }, [characterRef, getAudioContext]);

  const stopAllAudio = useCallback(() => {
    if (activeSingleSourceRef.current) {
      try { activeSingleSourceRef.current.stop(); } catch(e) {}
      activeSingleSourceRef.current = null;
    }
    
    activeStreamSourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    activeStreamSourcesRef.current.clear();
    
    nextStartTimeRef.current = 0;
    
    if (isStreamPlayingRef.current) {
      isStreamPlayingRef.current = false;
    }
    
    // This function should ONLY stop audio and visuals.
    // The responsibility of changing the app state belongs to the function that called stopAllAudio.
    stopVisualization();
  }, [stopVisualization]);
  
  const playAudio = useCallback(async (audioSource: string) => {
    stopAllAudio(); // Stop any currently playing audio first.
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    
    try {
      onPlaybackStateChange(true);
      
      let audioBuffer: AudioBuffer;
      // Check if the source is a URL/path or a base64 string
      // FIX: The previous check `audioSource.includes('/')` was too broad and could misclassify
      // a valid base64 string as a URL, because base64 can contain '/'.
      // This new check is more specific to our use cases (blob URLs or local audio paths).
      const isUrlLike = audioSource.startsWith('blob:') || audioSource.startsWith('audio/');

      if (isUrlLike) {
        // Handle blob URLs and direct paths by fetching and decoding as raw PCM data
        const response = await fetch(audioSource);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio from ${audioSource}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBytes = new Uint8Array(arrayBuffer);
        audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
      } else {
        // Assume it's a base64 string and decode it as raw PCM data
        const audioBytes = decode(audioSource);
        if (audioBytes.length === 0) {
            throw new Error('Received empty audio data (base64).');
        }
        audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      activeSingleSourceRef.current = source;
      
      if (analyserNodeRef.current) {
        source.connect(analyserNodeRef.current);
      } else {
        source.connect(audioCtx.destination);
      }

      return new Promise<void>(resolve => {
        const onEnded = () => {
          stopVisualization();
          onPlaybackStateChange(false);
          activeSingleSourceRef.current = null;
          resolve();
        };
        source.addEventListener('ended', onEnded, { once: true });
        source.start();
        visualizeAudio();
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      onPlaybackStateChange(false);
      // Ensure visualization is stopped on error
      stopVisualization();
    }
  }, [visualizeAudio, stopVisualization, onPlaybackStateChange, getAudioContext, stopAllAudio]);

  const queueAudioChunk = useCallback(async (base64Chunk: string) => {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;

    if (!isStreamPlayingRef.current) {
        isStreamPlayingRef.current = true;
        onPlaybackStateChange(true);
        visualizeAudio();
    }

    const audioBytes = decode(base64Chunk);
    const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
    
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    
    if (analyserNodeRef.current) {
      source.connect(analyserNodeRef.current);
    } else {
      source.connect(audioCtx.destination);
    }

    const startTime = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;
    
    activeStreamSourcesRef.current.add(source);
    
    source.onended = () => {
        activeStreamSourcesRef.current.delete(source);
        if (activeStreamSourcesRef.current.size === 0) {
            isStreamPlayingRef.current = false;
            stopVisualization();
            onPlaybackStateChange(false);
        }
    };

  }, [getAudioContext, visualizeAudio, stopVisualization, onPlaybackStateChange]);

  return { playAudio, queueAudioChunk, stopAllAudio };
};
