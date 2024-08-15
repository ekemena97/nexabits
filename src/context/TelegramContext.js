import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTapContext } from './TapContext.js'; // Import TapContext
import { debounce } from 'lodash';
import Loading from '../components/Loading.js'; // Import Loading component

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

const verifyTelegramWebAppData = async (telegramInitData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-telegram-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telegramInitData }),
    });

    if (!response.ok) {
      console.error('Network response was not ok for verifyTelegramWebAppData', response);
      throw new Error(`Network response was not ok for verifyTelegramWebAppData. Status: ${response.status}, URL: ${response.url}`);
    }

    const result = await response.json();
    console.log('Verification Response:', result);
    return result.verified;
  } catch (error) {
    console.error('Error verifying Telegram WebApp data:', error);
    return false;
  }
};

const TelegramContext = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [startParam, setStartParam] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [username, setUsername] = useState(null);
  const [isBot, setIsBot] = useState(null);
  const [isPremium, setIsPremium] = useState(null);
  const [telegramVerified, setTelegramVerified] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [verificationError, setVerificationError] = useState(null); // Verification error state

  const { count, coinsPerTap, energyLimit, refillRate, energy } = useTapContext(); // Destructure TapContext values

  useEffect(() => {
    const sessionData = sessionStorage.getItem('telegramUser');
    if (sessionData) {
      const { userId, startParam, firstName, username, isBot, isPremium } = JSON.parse(sessionData);
      setUserId(userId);
      setStartParam(startParam);
      setFirstName(firstName);
      setUsername(username);
      setIsBot(isBot);
      setIsPremium(isPremium);
      setTelegramVerified(true);
      setLoading(false); // Stop loading
      console.log('Loaded user data from sessionStorage:', { userId, firstName, username, isBot, isPremium });
    } else if (window.Telegram) {
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

      console.log('User Data:', { userId, firstName, username, isBot, isPremium });
      if (userId) {
        verifyTelegramWebAppData(telegram.initData).then((verified) => {
          if (verified) {
            console.log('Telegram data verified successfully');
            setTelegramVerified(true);
            sessionStorage.setItem('telegramUser', JSON.stringify({ userId, startParam, firstName, username, isBot, isPremium }));
            setLoading(false); // Stop loading

            console.log('Saving user data to Firestore');
            saveDataToFirestore(userId, { firstName, username, isBot, isPremium })
              .then(() => logIpAddress(userId))
              .catch(error => console.error('Error in initial saveDataToFirestore or logIpAddress:', error));

            if (startParam) {
              console.log('Saving referral data to Firestore');
              saveReferralToFirestore(userId, startParam).catch(error => console.error('Error in saveReferralToFirestore:', error));
            }
          } else {
            console.error('Telegram data verification failed');
            setVerificationError('Verification failed. Please try again.');
            setLoading(false); // Stop loading even if verification fails
          }
        }).catch(error => {
          console.error('Error verifying Telegram WebApp data:', error);
          setVerificationError('An error occurred during verification. Please try again.');
          setLoading(false); // Stop loading on error
        });
      } else {
        setLoading(false); // Stop loading if no userId
      }
    } else {
      console.error("Telegram WebApp is not available");
      setLoading(false); // Stop loading if Telegram WebApp is not available
    }
  }, []);

  // Log state changes from TapContext and save `coinsPerTap`, `energyLimit`, and `refillRate` immediately
  useEffect(() => {
    if (!userId || !telegramVerified) return;

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
  }, [userId, telegramVerified, coinsPerTap, energyLimit, refillRate]);

  // Save count after 20 seconds of no changes using debounce
  const debouncedSaveUserCount = useCallback(debounce(async (userId, count) => {
    try {
      await saveDataToFirestore(userId, { count });
      console.log('Count saved to Firestore:', count);
    } catch (error) {
      console.error('Error saving count to Firestore:', error);
    }
  }, 20000), []); // 20 seconds in milliseconds

  useEffect(() => {
    if (!userId || count === undefined || !telegramVerified) return;

    debouncedSaveUserCount(userId, count);

    return () => {
      debouncedSaveUserCount.cancel(); // Cleanup debounce on unmount or when count changes
    };
  }, [userId, count, telegramVerified, debouncedSaveUserCount]);

  return (
    <TelegramUserContext.Provider value={userId}>
      <TelegramStartappParamContext.Provider value={startParam}>
        <TelegramFirstNameContext.Provider value={firstName}>
          <TelegramUsernameContext.Provider value={username}>
            <TelegramIsBotContext.Provider value={isBot}>
              <TelegramIsPremiumContext.Provider value={isPremium}>
                {loading ? (
                  <Loading />
                ) : (
                  telegramVerified ? (
                    children
                  ) : (
                    <div>
                      
                      {children}
                    </div>
                  )
                )}
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
