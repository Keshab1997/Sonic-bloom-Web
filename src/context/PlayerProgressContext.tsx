import React, { createContext, useContext, useState, useRef, useCallback } from "react";

interface PlayerProgressContextType {
  progress: number;
  duration: number;
  setProgress: (v: number) => void;
  setDuration: (v: number) => void;
}

const PlayerProgressContext = createContext<PlayerProgressContextType | null>(null);

export const usePlayerProgress = () => {
  const ctx = useContext(PlayerProgressContext);
  if (!ctx) throw new Error("usePlayerProgress must be used within PlayerProgressProvider");
  return ctx;
};

export const PlayerProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  return (
    <PlayerProgressContext.Provider value={{ progress, duration, setProgress, setDuration }}>
      {children}
    </PlayerProgressContext.Provider>
  );
};
