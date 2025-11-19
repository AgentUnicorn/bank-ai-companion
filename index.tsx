import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext.tsx';
import {TranscriptProvider} from "./contexts/TranscriptContext.tsx";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
        <TranscriptProvider>
            <App />
        </TranscriptProvider>
    </LanguageProvider>
  </React.StrictMode>
);
