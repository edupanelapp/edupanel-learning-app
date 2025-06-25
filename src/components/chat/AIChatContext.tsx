import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIChatContextType {
  subject: string;
  topic: string;
  setContext: (subject: string, topic: string) => void;
  clearContext: () => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

interface AIChatProviderProps {
  children: ReactNode;
}

export function AIChatProvider({ children }: AIChatProviderProps) {
  const [subject, setSubject] = useState('General Studies');
  const [topic, setTopic] = useState('Learning Assistant');

  const setContext = (newSubject: string, newTopic: string) => {
    setSubject(newSubject);
    setTopic(newTopic);
  };

  const clearContext = () => {
    setSubject('General Studies');
    setTopic('Learning Assistant');
  };

  return (
    <AIChatContext.Provider value={{ subject, topic, setContext, clearContext }}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChatContext() {
  const context = useContext(AIChatContext);
  if (context === undefined) {
    throw new Error('useAIChatContext must be used within an AIChatProvider');
  }
  return context;
} 