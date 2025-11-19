

import React, { useMemo } from 'react';
import { AppState, InteractionMode } from '../types';

const SpeakingParticleEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const particles = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            key: i,
            delay: `${i * 0.2}s`,
            angle: `${Math.random() * 360}deg`,
            distance: `${580 + Math.random() * 450}px`,
        }));
    }, []);

    return (
        <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            {particles.map(p => (
                <div
                    key={p.key}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[particle-burst_5s_linear_infinite]"
                    style={{
                        animationDelay: p.delay,
                        '--angle': p.angle,
                        '--distance': p.distance,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};


const IdleParticleEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        {Array.from({ length: 12 }).map((_, i) => (
            <div
                key={i}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-500/80 rounded-full animate-[idle-particle-drift_infinite]"
                style={{
                    animationDuration: `${10 + Math.random() * 8}s`,
                    animationDelay: `${i * 0.5}s`,
                    '--rand': Math.random(),
                    '--angle': `${i * 30}deg`,
                } as React.CSSProperties}
            />
        ))}
    </div>
);


const ListeningRingsEffect: React.FC<{ isVoiceActive: boolean }> = ({ isVoiceActive }) => {
    if (!isVoiceActive) {
        // Idle rings (faint gray)
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none z-0 scale-50">
                <div className="absolute w-[68%] h-auto aspect-square rounded-full border border-gray-400/20" style={{ animation: 'hud-spin 40s linear infinite, idle-pulse-ring 8s ease-in-out infinite' }}></div>
                <div className="absolute w-[74%] h-auto aspect-square rounded-full border-2 border-gray-400/20" style={{ animation: 'hud-spin 35s linear infinite reverse, idle-pulse-ring 8s ease-in-out infinite 1s' }}></div>
                <div className="absolute w-[80%] h-auto aspect-square rounded-full border border-gray-400/20" style={{ animation: 'hud-spin 30s linear infinite, idle-pulse-ring 8s ease-in-out infinite 0.5s' }}></div>
                <div className="absolute w-[86%] h-auto aspect-square rounded-full border border-gray-400/20" style={{ animation: 'hud-spin 25s linear infinite reverse, idle-pulse-ring 8s ease-in-out infinite 1.5s' }}></div>
            </div>
        );
    }
    
    // Active voice rings (bright cyan)
    return (
        <div className={`absolute w-[200%] h-auto aspect-square flex items-center justify-center pointer-events-none z-0 opacity-40`}>
            <div className={`absolute inset-0 rounded-full border border-cyan-400/60 animate-[hud-spin_16s_linear_infinite]`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0 20%, 0 40%, 100% 40%, 100% 60%, 0 60%, 0 80%, 100% 80%, 100% 100%, 0 100%)' }}></div>
            <div className={`absolute inset-[20%] rounded-full border border-cyan-400/60 animate-[hud-spin_12s_linear_infinite_reverse]`} style={{ clipPath: 'polygon(20% 0, 80% 0, 80% 100%, 20% 100%)' }}></div>
        </div>
    );
};

interface SilhouetteCharacterProps {
  appState: AppState;
  imageUrl?: string;
  characterRef: React.RefObject<HTMLImageElement>;
  interactionMode: InteractionMode;
}
const SilhouetteCharacter: React.FC<SilhouetteCharacterProps> = ({ appState, imageUrl, characterRef, interactionMode }) => {
  const isSpeaking = appState === AppState.SPEAKING;
  const isIdle = appState === AppState.IDLE;
  const isVoiceActive = interactionMode === 'voice' && (appState === AppState.LISTENING || appState === AppState.SPEAKING);

  const animationClass = isSpeaking
    ? 'animate-[speaking-sway_4s_ease-in-out_infinite]'
    : isIdle
    ? 'animate-[idle-breathe_4s_ease-in-out_infinite]'
    : '';

  return (
   <div id="silhouette-character-container" className={`relative flex h-[88%] items-center justify-center z-10 transition-opacity duration-300`}>
        <style>{`
            @keyframes equalizer-wave {
                0%, 100% { transform: scaleY(0.3); }
                50% { transform: scaleY(1); }
            }
            @keyframes particle-burst {
                0% {
                    transform: rotate(var(--angle)) translateY(0) scale(0.8);
                    opacity: 1;
                }
                100% {
                    transform: rotate(var(--angle)) translateY(calc(-1 * var(--distance))) scale(0);
                    opacity: 0;
                }
            }
            @keyframes idle-particle-drift {
                0% {
                    transform: rotate(var(--angle)) translateY(0) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: rotate(var(--angle)) translateY(calc(-80px - (50px * var(--rand)))) scale(0);
                    opacity: 0;
                }
            }
            @keyframes hud-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes idle-pulse-ring { 
                0%, 100% { opacity: 0; } 
                50% { opacity: 0.3; } 
            }
        `}</style>
        
        <ListeningRingsEffect isVoiceActive={isVoiceActive} />

        <div className="absolute w-full h-24 top-1/2 -translate-y-1/2 flex justify-center items-center gap-40 opacity-70">
            {[-1, 1].map(side => (
                <div key={side} className="flex items-end justify-center gap-1.5 h-12" style={{ transform: `scaleX(${side})` }}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-full bg-gradient-to-t from-cyan-500/50 to-cyan-300/80 transition-opacity duration-500 ${isVoiceActive ? 'animate-[equalizer-wave_1.5s_ease-out_infinite]' : 'opacity-0'}`}
                            style={{
                                height: `${10 + (i % 4) * 8}px`,
                                animationDelay: `${i * 0.1 + Math.random() * 0.2}s`
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>

        <div className="absolute inset-0 pointer-events-none">
            <SpeakingParticleEffect isActive={isSpeaking} />
            <IdleParticleEffect isActive={isIdle && interactionMode === null} />
        </div>
       
        <div 
            className="absolute w-full h-full bg-cyan-500/50 rounded-full transition-opacity duration-1000"
            style={{ 
                filter: 'blur(150px)',
                opacity: isSpeaking ? 'var(--aura-opacity, 0)' : '0',
            }}
        />
       {imageUrl ? (
            <img
                ref={characterRef}
                src={imageUrl}
                alt="AI companion"
                className={`relative object-contain w-full h-full transition-all duration-500 ${animationClass}`}
                style={{
                  transform: `scale(var(--glow-scale, 1))`,
                  filter: isSpeaking ? `drop-shadow(0 0 15px var(--accent-glow)) drop-shadow(0 0 30px var(--accent-glow))` : 'none'
                }}
            />
        ) : (
            <div className="w-full h-full max-w-[450px] max-h-[800px] flex items-center justify-center text-gray-500">
                <p>Loading character...</p>
            </div>
        )}
    </div>
  );
};

export default SilhouetteCharacter;