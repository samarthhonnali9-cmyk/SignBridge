import { createContext, useContext, useState, useEffect } from 'react';

const SignContext = createContext();

export function SignProvider({ children }) {
  const [standard, setStandard] = useState('ASL'); // ASL, BSL, ISL
  const [language, setLanguage] = useState('en-US');
  const [sessionStats, setSessionStats] = useState({
    totalGestures: 0,
    averageAccuracy: 94,
    responseTime: 120,
    startTime: Date.now()
  });

  const value = {
    standard,
    setStandard,
    language,
    setLanguage,
    sessionStats,
    setSessionStats
  };

  return (
    <SignContext.Provider value={value}>
      {children}
    </SignContext.Provider>
  );
}

export const useSign = () => useContext(SignContext);
