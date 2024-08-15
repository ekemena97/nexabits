import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import useEnergyUpdater from '../components/useEnergyUpdater.js';
import { getStorageItem, setStorageItem } from '../components/storageHelpers.js';
import { useTimeLapse } from './TimeContext.js';

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const [count, setCount] = useState(5000);
  const [coinsPerTap, setCoinsPerTap] = useState(1);
  const [energyLimit, setEnergyLimit] = useState(500);
  const [refillRate, setRefillRate] = useState(2400);
  const [energy, setEnergy] = useState(500);
  const hasInitialized = useRef(false);
  const { elapsedLapse } = useTimeLapse(); // Get elapsed lapse from TimeLapseContext

  const validateValue = (value, defaultValue) => {
    return value !== null && value !== undefined && value !== 'undefined' ? value : defaultValue;
  };

  const fetchStoredValue = async (key, defaultValue) => {
    let attempts = 0;
    const maxAttempts = 3;
    const backoffDelay = 500; // milliseconds

    while (attempts < maxAttempts) {
      try {
        const value = await getStorageItem(key);
        const validatedValue = validateValue(value, defaultValue);
        if (validatedValue !== defaultValue || attempts === maxAttempts - 1) {
          return validatedValue;
        }
      } catch (error) {
        console.error(`Error fetching storage item "${key}":`, error);
      }
      attempts += 1;
      await new Promise(resolve => setTimeout(resolve, backoffDelay * attempts));
    }

    return defaultValue;
  };

  const calculateInitialEnergy = (energyLimit, elapsedLapse) => {
    const minutesElapsed = elapsedLapse / 60; // Convert seconds to minutes
    const requiredMinutes = energyLimit / 100; // 500 energy requires 5 minutes, so energyLimit/100

    if (minutesElapsed >= requiredMinutes) {
      return energyLimit;
    }

    let storedEnergy;
    try {
      const energyFromStorage = localStorage.getItem('energy');
      if (energyFromStorage === null || energyFromStorage === undefined || energyFromStorage === 'undefined') {
        storedEnergy = energyLimit / 2;
      } else {
        storedEnergy = JSON.parse(energyFromStorage);
      }
    } catch (error) {
      console.error("Error parsing energy from local storage:", error);
      storedEnergy = energyLimit / 2;
    }

    return storedEnergy;
  };

  const initializeState = useCallback(async () => {
    if (hasInitialized.current) return;

    const initialCount = await fetchStoredValue('count', 5000);
    const initialCoinsPerTap = await fetchStoredValue('coinsPerTap', 1);
    const initialEnergyLimit = await fetchStoredValue('energyLimit', 500);
    const initialRefillRate = await fetchStoredValue('refillRate', 2400);
    const initialEnergy = calculateInitialEnergy(initialEnergyLimit, elapsedLapse);

    setCount(initialCount);
    setCoinsPerTap(initialCoinsPerTap);
    setEnergyLimit(initialEnergyLimit);
    setRefillRate(initialRefillRate);
    setEnergy(initialEnergy);

    hasInitialized.current = true;
  }, [elapsedLapse]);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  useEnergyUpdater(setEnergy, energyLimit, refillRate);

  const updateStateAndStorage = useCallback((key, value, setState) => {
    setState(value);
    console.log(`Setting storage item "${key}" to:`, value);
    if (value !== undefined) {
      if (['count', 'coinsPerTap', 'energyLimit', 'refillRate'].includes(key)) {
        setStorageItem(key, value); // Store in Telegram Cloud Storage
      } else {
        localStorage.setItem(key, JSON.stringify(value)); // Store in localStorage
      }
    } else {
      console.error(`Attempted to set undefined value for key "${key}"`);
    }
  }, []);

  const debouncedSaveCount = useCallback(
    debounce((value) => {
      setStorageItem('count', value);
    }, 1000),
    []
  );

  useEffect(() => {
    if (hasInitialized.current) {
      debouncedSaveCount(count);
    }
    return debouncedSaveCount.cancel;
  }, [count, debouncedSaveCount]);

  const incrementTap = () => {
    setCount((prevCount) => {
      const newCount = prevCount + coinsPerTap;
      console.log('New Count:', newCount);
      return newCount;
    });
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - 1, 0);
      console.log('New Energy:', newEnergy);
      updateStateAndStorage('energy', newEnergy, setEnergy);
      return newEnergy;
    });
  };

  const incrementPoints = (points) => {
    setCount((prevCount) => {
      const newCount = prevCount + points;
      return newCount;
    });
  };

  const decrementCount = (amount) => {
    setCount((prevCount) => {
      const newCount = prevCount - amount;
      return newCount;
    });
  };

  useEffect(() => {
    console.log(`Current coinsPerTap: ${coinsPerTap}`);
    console.log(`Current energyLimit: ${energyLimit}`);
  }, [coinsPerTap, energyLimit]);

  useEffect(() => {
    console.log('Context updated:', { coinsPerTap, energyLimit });
  }, [coinsPerTap, energyLimit]);

  return (
    <TapContext.Provider value={{
      count,
      incrementTap,
      incrementPoints,
      coinsPerTap,
      setCoinsPerTap: (value) => updateStateAndStorage('coinsPerTap', value, setCoinsPerTap),
      energyLimit,
      setEnergyLimit: (value) => updateStateAndStorage('energyLimit', value, setEnergyLimit),
      refillRate,
      setRefillRate: (value) => updateStateAndStorage('refillRate', value, setRefillRate),
      decrementCount,
      energy,
      setEnergy: (value) => updateStateAndStorage('energy', value, setEnergy),
      updateStateAndStorage,
    }}>
      {children}
    </TapContext.Provider>
  );
};

export default TapProvider;
