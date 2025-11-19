

import React from 'react';

const ThinkingBubbleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path 
            d="M17 2.42969H7C4 2.42969 2 4.42969 2 7.42969V13.4297C2 16.4297 4 18.4297 7 18.4297H11L15.45 21.3897C16.11 21.8297 17 21.3597 17 20.5597V18.4297C20 18.4297 22 16.4297 22 13.4297V7.42969C22 4.42969 20 2.42969 17 2.42969Z"
            fill="white"
            stroke="#e0f7fa"
            strokeWidth="0.5"
        />
    </svg>
);


const ThinkingAnimation: React.FC = () => {
    return (
        <div 
            id="thinking-animation" 
            className="absolute top-[18%] left-[12%] z-20 animate-[fadeIn_0.5s_ease-out]"
            style={{ pointerEvents: 'none' }}
        >
            <style>{`
                @keyframes thinking-blink {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
            <div className="relative w-28 h-28">
                <ThinkingBubbleIcon className="absolute inset-0 w-full h-full text-white filter drop-shadow-lg" />
                <div className="absolute inset-0 flex items-center justify-center gap-2.5">
                    <span 
                        className="w-3.5 h-3.5 bg-cyan-500 rounded-full"
                        style={{ animation: 'thinking-blink 1.4s infinite 0s' }}
                    />
                    <span 
                        className="w-3.5 h-3.5 bg-cyan-500 rounded-full"
                        style={{ animation: 'thinking-blink 1.4s infinite 0.2s' }}
                    />
                    <span 
                        className="w-3.5 h-3.5 bg-cyan-500 rounded-full"
                        style={{ animation: 'thinking-blink 1.4s infinite 0.4s' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ThinkingAnimation;