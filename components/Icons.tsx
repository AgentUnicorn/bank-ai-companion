
import React from 'react';

// FIX: Add missing TransferIcon and export it for use in other components.
export const TransferIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_transfer_icon)">
            <path d="M9.5 13.7502C9.5 14.7202 10.25 15.5002 11.17 15.5002H13.05C13.85 15.5002 14.5 14.8202 14.5 13.9702C14.5 13.0602 14.1 12.7302 13.51 12.5202L10.5 11.4702C9.91 11.2602 9.51001 10.9402 9.51001 10.0202C9.51001 9.18023 10.16 8.49023 10.96 8.49023H12.84C13.76 8.49023 14.51 9.27023 14.51 10.2402" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2C6.48 2 2 6.48 2 12C2 15.94 4.28001 19.35 7.60001 20.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 12C22 17.52 17.52 22 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 6V2H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 7L22 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_transfer_icon">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3-3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
);

export const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 5.25A2.25 2.25 0 005.25 7.5v9A2.25 2.25 0 007.5 18.75h9A2.25 2.25 0 0018.75 16.5v-9A2.25 2.25 0 0016.5 5.25h-9z" clipRule="evenodd" />
    </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_history_icon)">
            <path d="M16.42 7.94923C18.86 10.3892 18.86 14.3492 16.42 16.7892C13.98 19.2292 10.02 19.2292 7.58 16.7892C5.14 14.3492 5.14 10.3892 7.58 7.94923C8.95 6.57923 10.81 5.97924 12.6 6.14924" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.24999 21.6409C6.24999 20.8409 4.49999 19.3909 3.33999 17.3809C2.19999 15.4109 1.81999 13.2209 2.08999 11.1309" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.8501 4.47937C7.5501 3.14937 9.68009 2.35938 12.0001 2.35938C14.2701 2.35938 16.3601 3.12936 18.0401 4.40936" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.75 21.6409C17.75 20.8409 19.5 19.3909 20.66 17.3809C21.8 15.4109 22.18 13.2209 21.91 11.1309" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_history_icon">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const UserInfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);


export const NagaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_4418_8011)">
            <path d="M19.1199 9.12035C18.7299 9.12035 18.4199 9.43035 18.4199 9.82035V11.4004C18.4199 14.9404 15.5399 17.8204 11.9999 17.8204C8.45993 17.8204 5.57993 14.9404 5.57993 11.4004V9.81035C5.57993 9.42035 5.26993 9.11035 4.87993 9.11035C4.48993 9.11035 4.17993 9.42035 4.17993 9.81035V11.3904C4.17993 15.4604 7.30993 18.8104 11.2999 19.1704V21.3004C11.2999 21.6904 11.6099 22.0004 11.9999 22.0004C12.3899 22.0004 12.6999 21.6904 12.6999 21.3004V19.1704C16.6799 18.8204 19.8199 15.4604 19.8199 11.3904V9.81035C19.8099 9.43035 19.4999 9.12035 19.1199 9.12035Z" />
            <path d="M12.0001 2C9.56008 2 7.58008 3.98 7.58008 6.42V11.54C7.58008 13.98 9.56008 15.96 12.0001 15.96C14.4401 15.96 16.4201 13.98 16.4201 11.54V6.42C16.4201 3.98 14.4401 2 12.0001 2ZM13.3101 8.95C13.2401 9.21 13.0101 9.38 12.7501 9.38C12.7001 9.38 12.6501 9.37 12.6001 9.36C12.2101 9.25 11.8001 9.25 11.4101 9.36C11.0901 9.45 10.7801 9.26 10.7001 8.95C10.6101 8.64 10.8001 8.32 11.1101 8.24C11.7001 8.08 12.3201 8.08 12.9101 8.24C13.2101 8.32 13.3901 8.64 13.3101 8.95ZM13.8401 7.01C13.7501 7.25 13.5301 7.39 13.2901 7.39C13.2201 7.39 13.1601 7.38 13.0901 7.36C12.3901 7.1 11.6101 7.1 10.9101 7.36C10.6101 7.47 10.2701 7.31 10.1601 7.01C10.0501 6.71 10.2101 6.37 10.5101 6.27C11.4701 5.92 12.5301 5.92 13.4901 6.27C13.7901 6.38 13.9501 6.71 13.8401 7.01Z" />
        </g>
        <defs>
            <clipPath id="clip0_4418_8011">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PanelOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const PanelCloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export const StaticSoundWaveIcon: React.FC<{ className?: string }> = ({ className }) => {
    const bars = [0.4, 0.7, 1, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4];
    return (
        <div className={`flex items-center justify-center gap-0.5 w-20 h-6 ${className}`}>
            {bars.map((height, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-white/90 rounded-full" 
                    style={{ height: `${10 + height * 80}%` }} 
                />
            ))}
        </div>
    );
};