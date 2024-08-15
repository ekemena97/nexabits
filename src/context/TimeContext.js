// TimeContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

const TimeLapseContext = createContext();

export const useTimeLapse = () => useContext(TimeLapseContext);

const getElapsedLapse = (lastLapse) => {
  const currentLapse = new Date().getTime();
  return (currentLapse - lastLapse) / 1000; // returns elapsed time in seconds
};

export const TimeLapseProvider = ({ children }) => {
  const [lastLapse, setLastLapse] = useState(null);
  const [elapsedLapse, setElapsedLapse] = useState(0);

  useEffect(() => {
    const storedLastLapse = parseInt(localStorage.getItem('lastLapse'), 10);
    if (storedLastLapse) {
      setLastLapse(storedLastLapse);
      const elapsed = getElapsedLapse(storedLastLapse);
      setElapsedLapse(elapsed);
    }

    const intervalId = setInterval(() => {
      const currentLapse = new Date().getTime();
      localStorage.setItem('lastLapse', currentLapse);
      setLastLapse(currentLapse);
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TimeLapseContext.Provider value={{ lastLapse, elapsedLapse }}>
      {children}
    </TimeLapseContext.Provider>
  );
};
