import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTapContext } from './TapContext.js'; // Import TapContext
import { debounce } from 'lodash';

const TelegramUserContext = createContext();
const TelegramStartappParamContext = createContext();
const TelegramFirstNameContext = createContext();
const TelegramUsernameContext = createContext();
const TelegramIsBotContext = createContext();
const TelegramIsPremiumContext = createContext();

export const useTelegramUser = () => useContext(TelegramUserContext);
export const useTelegramStartappParam = () => useContext(TelegramStartappParamContext);
export const useTelegramFirstName = () => useContext(TelegramFirstNameContext);
export const useTelegramUsername = () => useContext(TelegramUsernameContext);
export const useTelegramIsBot = () => useContext(TelegramIsBotContext);
export const useTelegramIsPremium = () => useContext(TelegramIsPremiumContext);

const saveDataToFirestore = async (userId, data) => {
  try {
    const payload = {
      id: userId,
      ...data,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending user data to Firestore', payload);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Network response was not ok for saveDataToFirestore', response);
      throw new Error(`Network response was not ok for saveDataToFirestore. Status: ${response.status}, URL: ${response.url}`);
    }

    const result = await response.json().catch((err) => {
      console.error('Failed to parse JSON from saveDataToFirestore', err);
      throw new Error('Response is not valid JSON for saveDataToFirestore');
    });

    console.log('TapUser data saved successfully:', result);
  } catch (error) {
    console.error('Error saving TapUser data:', error);
  }
};

const saveReferralToFirestore = async (userId, referrerId) => {
  try {
    const payload = {
      referrerId,
      userId,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending referral data to Firestore', payload);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/referral`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Network response was not ok for saveReferralToFirestore', response);
      throw new Error(`Network response was not ok for saveReferralToFirestore. Status: ${response.status}, URL: ${response.url}`);
    }

    const result = await response.json().catch((err) => {
      console.error('Failed to parse JSON from saveReferralToFirestore', err);
      throw new Error('Response is not valid JSON for saveReferralToFirestore');
    });

    console.log('Referral data saved successfully:', result);
  } catch (error) {
    console.error('Error saving Referral data:', error);
  }
};

const logIpAddress = async (userId) => {
  if (!userId) return;

  try {
    console.log(`Logging IP address for userId: ${userId}`);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/log-ip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`, response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json().catch((err) => {
      console.error('Failed to parse JSON from logIpAddress', err);
      throw new Error('Response is not valid JSON for logIpAddress');
    });

    console.log('IP address logged successfully. Response:', result);
  } catch (error) {
    console.error('Error logging IP address:', error);
  }
};

const TelegramContext = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [startParam, setStartParam] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [username, setUsername] = useState(null);
  const [isBot, setIsBot] = useState(null);
  const [isPremium, setIsPremium] = useState(null);

  const { count, coinsPerTap, energyLimit, refillRate, energy } = useTapContext(); // Destructure TapContext values

  useEffect(() => {
    if (window.Telegram) {
      const telegram = window.Telegram.WebApp;
      telegram.ready();

      const initData = telegram.initDataUnsafe;
      console.log('initData:', initData);

      const userId = initData?.user?.id;
      const startParam = initData?.start_param;
      const firstName = initData?.user?.first_name;
      const username = initData?.user?.username;
      const isBot = initData?.user?.is_bot || false;
      const isPremium = initData?.user?.is_premium || false;

      setUserId(userId);
      setStartParam(startParam);
      setFirstName(firstName);
      setUsername(username);
      setIsBot(isBot);
      setIsPremium(isPremium);

      if (userId) {
        console.log('Saving user data to Firestore');
        saveDataToFirestore(userId, { firstName, username, isBot, isPremium })
          .then(() => logIpAddress(userId))
          .catch(error => console.error('Error in initial saveDataToFirestore or logIpAddress:', error));

        if (startParam) {
          console.log('Saving referral data to Firestore');
          saveReferralToFirestore(userId, startParam).catch(error => console.error('Error in saveReferralToFirestore:', error));
        }
      }
    } else {
      console.error("Telegram WebApp is not available");
    }
  }, []);

  // Log state changes from TapContext and save `coinsPerTap`, `energyLimit`, and `refillRate` immediately
  useEffect(() => {
    if (!userId) return;

    console.log('TapContext useEffect is running');
    console.log('TapContext values changed:', { count, coinsPerTap, energyLimit, refillRate, energy });

    const saveTapUserData = async () => {
      try {
        let updateData = {};
        if (coinsPerTap !== undefined) updateData.coinsPerTap = coinsPerTap;
        if (energyLimit !== undefined) updateData.energyLimit = energyLimit;
        if (refillRate !== undefined) updateData.refillRate = refillRate;

        await saveDataToFirestore(userId, updateData);
      } catch (error) {
        console.error('Error saving TapUser data:', error);
      }
    };

    saveTapUserData();
  }, [userId, coinsPerTap, energyLimit, refillRate]);

  // Save count after 10 seconds of no changes using debounce
  const debouncedSaveCount = useCallback(debounce(async (userId, count) => {
    try {
      await saveDataToFirestore(userId, { count });
      console.log('Count saved to Firestore:', count);
    } catch (error) {
      console.error('Error saving count to Firestore:', error);
    }
  }, 20000), []); // 10 seconds in milliseconds

  useEffect(() => {
    if (!userId || count === undefined) return;

    debouncedSaveCount(userId, count);

    return () => {
      debouncedSaveCount.cancel(); // Cleanup debounce on unmount or when count changes
    };
  }, [userId, count, debouncedSaveCount]);

  return (
    <TelegramUserContext.Provider value={userId}>
      <TelegramStartappParamContext.Provider value={startParam}>
        <TelegramFirstNameContext.Provider value={firstName}>
          <TelegramUsernameContext.Provider value={username}>
            <TelegramIsBotContext.Provider value={isBot}>
              <TelegramIsPremiumContext.Provider value={isPremium}>
                {children}
              </TelegramIsPremiumContext.Provider>
            </TelegramIsBotContext.Provider>
          </TelegramUsernameContext.Provider>
        </TelegramFirstNameContext.Provider>
      </TelegramStartappParamContext.Provider>
    </TelegramUserContext.Provider>
  );
};

export { saveDataToFirestore, saveReferralToFirestore, logIpAddress };
export default TelegramContext;
