import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useTelegramUser } from './TelegramContext.js';
import useEnergyUpdater from '../components/useEnergyUpdater.js';

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const userId = useTelegramUser();

  const calculateInitialEnergy = () => {
    const storedEnergy = getParsedLocalStorageItem('energy', 500);
    const lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime'), 10) || Date.now();
    const elapsedSeconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    const refillRate = getParsedLocalStorageItem('refillRate', 2400); // Original refillRate
    const energyLimit = getParsedLocalStorageItem('energyLimit', 500);
    const energyGain = Math.floor(elapsedSeconds / refillRate);
    const initialEnergy = Math.min(storedEnergy + energyGain, energyLimit);

    console.log('calculateInitialEnergy:', { storedEnergy, lastUpdateTime, elapsedSeconds, energyGain, initialEnergy });
    return initialEnergy;
  };

  const [count, setCount] = useState(() => getParsedLocalStorageItem('count', 50));
  const [coinsPerTap, setCoinsPerTap] = useState(() => getParsedLocalStorageItem('coinsPerTap', 1));
  const [energyLimit, setEnergyLimit] = useState(() => getParsedLocalStorageItem('energyLimit', 500));
  const [refillRate, setRefillRate] = useState(() => getParsedLocalStorageItem('refillRate', 2400)); // Original refillRate
  const [energy, setEnergy] = useState(calculateInitialEnergy);

  const stateChanged = useRef(false);
  const lastUpdate = useRef(Date.now());

  const logIpAddress = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/log-ip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('IP address logged successfully.');
    } catch (error) {
      console.error('Error logging IP address:', error);
    }
  }, [userId]);

  const updateFirestoreUser = useCallback(async () => {
    if (!userId) return;

    try {
      const user = {
        count,
        coinsPerTap,
        energyLimit,
        refillRate,
        lastUpdateTime: Date.now(),
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const text = await response.text();
      try {
        JSON.parse(text);
      } catch (jsonError) {
        // Non-JSON response
      }

      stateChanged.current = false;
      console.log('Firestore user updated:', user);
    } catch (error) {
      console.error(`Error updating user data: ${error}`);
    }
  }, [userId, count, coinsPerTap, energyLimit, refillRate]);

  useEffect(() => {
    logIpAddress(); 
  }, [logIpAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (stateChanged.current && (currentTime - lastUpdate.current >= 60 * 1000)) {
        updateFirestoreUser();
        lastUpdate.current = currentTime;
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [updateFirestoreUser]);

  const updateStateAndLocalStorage = useCallback((key, value, setState) => {
    setState(value);
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.error(`Attempted to set undefined value for key "${key}"`);
    }
    if (['count', 'coinsPerTap', 'energyLimit', 'refillRate'].includes(key)) {
      stateChanged.current = true;
    }
  }, []);

  useEnergyUpdater(setEnergy, energyLimit, refillRate);

  const incrementTap = () => {
    setCount(prevCount => {
      const newCount = prevCount + coinsPerTap;
      localStorage.setItem('count', JSON.stringify(newCount));
      stateChanged.current = true;
      console.log('incrementTap: newCount:', newCount);
      return newCount;
    });
    setEnergy(prevEnergy => {
      const newEnergy = Math.max(prevEnergy - 1, 0);
      if (newEnergy !== undefined) {
        localStorage.setItem('energy', JSON.stringify(newEnergy));
        console.log('incrementTap: newEnergy:', newEnergy);
      } else {
        console.error('incrementTap: newEnergy is undefined');
      }
      return newEnergy;
    });
  };

  const incrementPoints = (points) => {
    setCount(prevCount => {
      const newCount = prevCount + points;
      localStorage.setItem('count', JSON.stringify(newCount));
      stateChanged.current = true;
      console.log('incrementPoints: newCount:', newCount);
      return newCount;
    });
  };

  const decrementCount = (amount) => {
    setCount(prevCount => {
      const newCount = prevCount - amount;
      localStorage.setItem('count', JSON.stringify(newCount));
      stateChanged.current = true;
      console.log('decrementCount: newCount:', newCount);
      return newCount;
    });
  };

  return (
    <TapContext.Provider
      value={{
        userId,
        count,
        incrementTap,
        incrementPoints,
        coinsPerTap,
        setCoinsPerTap: (value) => updateStateAndLocalStorage('coinsPerTap', value, setCoinsPerTap),
        energyLimit,
        setEnergyLimit: (value) => updateStateAndLocalStorage('energyLimit', value, setEnergyLimit),
        refillRate,
        setRefillRate: (value) => updateStateAndLocalStorage('refillRate', value, setRefillRate),
        decrementCount,
        energy,
        setEnergy: (value) => updateStateAndLocalStorage('energy', value, setEnergy),
        updateStateAndLocalStorage,
      }}
    >
      {children}
    </TapContext.Provider>
  );
};

const getParsedLocalStorageItem = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  console.log(`getParsedLocalStorageItem: key=${key}, storedValue=${storedValue}`);
  if (storedValue === null || storedValue === undefined || storedValue === 'undefined') {
    console.log(`Stored value is null or undefined, returning defaultValue: ${defaultValue}`);
    return defaultValue;
  }
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export default TapProvider;
