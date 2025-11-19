import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { en } from './locales/en';

type Translations = typeof en;

interface LanguageContextType {
  language: 'en';
  t: (key: keyof Translations, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // FIX: Update the implementation of `t` to match its type signature, which accepts optional arguments.
  // This makes the function more robust and may resolve a subtle bug causing a runtime error.
  const t = useCallback((key: keyof Translations, ...args: any[]): string => {
    let translation = en[key] || key;
    if (args.length > 0 && typeof translation === 'string') {
      // a simple formatter for positional placeholders like "Hello {0}"
      return translation.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
      });
    }
    return translation;
  }, []);

  return (
    <LanguageContext.Provider value={{ language: 'en', t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};