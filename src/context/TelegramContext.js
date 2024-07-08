// src/context/TelegramContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const TelegramUserContext = createContext();

export const useTelegramUser = () => useContext(TelegramUserContext);

const TelegramContext = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (window.Telegram) {
      const telegram = window.Telegram.WebApp;
      telegram.ready();

      // Parse initData to get the userId
      const initData = telegram.initDataUnsafe;
      const userId = initData?.user?.id;

      if (userId) {
        setUserId(userId);
      }
    } else {
      console.error("Telegram WebApp is not available");
    }
  }, []);

  return (
    <TelegramUserContext.Provider value={userId}>
      {children}
    </TelegramUserContext.Provider>
  );
};

export default TelegramContext;