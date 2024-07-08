import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useTelegramUser } from './TelegramContext.js'; // Import the hook from TelegramContext

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const userId = useTelegramUser(); // Use the hook to get userId

  const calculateInitialEnergy = () => {
    const storedEnergy = getParsedLocalStorageItem('energy', 500);
    const lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime'), 10) || Date.now();
    const elapsedSeconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    const refillRate = getParsedLocalStorageItem('refillRate', 2400);
    const energyLimit = getParsedLocalStorageItem('energyLimit', 500);
    const energyGain = Math.floor(elapsedSeconds / refillRate);
    const initialEnergy = Math.min(storedEnergy + energyGain, energyLimit);

    // Debugging logs
    console.log("Stored Energy:", storedEnergy);
    console.log("Last Update Time:", lastUpdateTime);
    console.log("Elapsed Seconds:", elapsedSeconds);
    console.log("Energy Gain:", energyGain);
    console.log("Initial Energy Calculated:", initialEnergy);

    return initialEnergy;
  };

  const [count, setCount] = useState(() => getParsedLocalStorageItem('count', 50));
  const [coinsPerTap, setCoinsPerTap] = useState(() => getParsedLocalStorageItem('coinsPerTap', 1));
  const [energyLimit, setEnergyLimit] = useState(() => getParsedLocalStorageItem('energyLimit', 500));
  const [refillRate, setRefillRate] = useState(() => getParsedLocalStorageItem('refillRate', 2400));
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
    } catch (error) {
      console.error(`Error updating user data: ${error}`);
    }
  }, [userId, count, coinsPerTap, energyLimit, refillRate]);

  useEffect(() => {
    logIpAddress(); // Log IP address when the component mounts or userId changes
  }, [logIpAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (stateChanged.current && (currentTime - lastUpdate.current >= 60 * 1000)) {
        updateFirestoreUser();
        lastUpdate.current = currentTime;
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [updateFirestoreUser]);

  const updateStateAndLocalStorage = useCallback((key, value, setState) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
    if (['count', 'coinsPerTap', 'energyLimit', 'refillRate'].includes(key)) {
      stateChanged.current = true;
    }
  }, []);

  const calculateEnergyGain = () => {
    const lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime'), 10) || Date.now();
    const elapsedSeconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    const energyGain = Math.floor(elapsedSeconds / refillRate);
    
    // Debugging logs
    console.log("Calculating Energy Gain:");
    console.log("Last Update Time:", lastUpdateTime);
    console.log("Elapsed Seconds:", elapsedSeconds);
    console.log("Energy Gain Calculated:", energyGain);
    
    return energyGain;
  };

  const applyEnergyGain = useCallback(() => {
    const energyGain = calculateEnergyGain();
    setEnergy(prevEnergy => {
      const newEnergy = Math.min(prevEnergy + energyGain, energyLimit);
      console.log("Applying Energy Gain:", energyGain, "New Energy:", newEnergy); // Debugging log
      return newEnergy;
    });
    localStorage.setItem('lastUpdateTime', Date.now().toString());
  }, [energyLimit, refillRate]);

  useEffect(() => {
    applyEnergyGain();
  }, [applyEnergyGain]);

  useEffect(() => {
    const interval = setInterval(() => {
      applyEnergyGain();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [applyEnergyGain]);

  useEffect(() => {
    localStorage.setItem('energy', JSON.stringify(energy));
  }, [energy]);

  const incrementTap = () => {
    setCount(prevCount => {
      const newCount = prevCount + coinsPerTap;
      localStorage.setItem('count', JSON.stringify(newCount));
      stateChanged.current = true;
      return newCount;
    });
    setEnergy(prevEnergy => {
      const newEnergy = Math.max(prevEnergy - 1, 0);
      localStorage.setItem('energy', JSON.stringify(newEnergy));
      return newEnergy;
    });
  };

  const incrementPoints = (points) => {
    setCount(prevCount => {
      const newCount = prevCount + points;
      localStorage.setItem('count', JSON.stringify(newCount));
      stateChanged.current = true;
      return newCount;
    });
  };

  const decrementCount = (amount) => {
    setCount(prevCount => {
      const newCount = prevCount - amount;
      localStorage.setItem('count', JSON.stringify(newCount));
      stateChanged.current = true;
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
  try {
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export default TapProvider;