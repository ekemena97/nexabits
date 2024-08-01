import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import useEnergyUpdater from '../components/useEnergyUpdater.js';
import { getStorageItem, setStorageItem } from '../components/storageHelpers.js';

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const [count, setCount] = useState(50);
  const [coinsPerTap, setCoinsPerTap] = useState(1);
  const [energyLimit, setEnergyLimit] = useState(500);
  const [refillRate, setRefillRate] = useState(2400);

  const initializeState = useCallback(async () => {
    const storedCount = await getStorageItem('count');
    const storedCoinsPerTap = await getStorageItem('coinsPerTap');
    const storedEnergyLimit = await getStorageItem('energyLimit');
    const storedRefillRate = await getStorageItem('refillRate');

    if (storedCount !== null) setCount(storedCount);
    if (storedCoinsPerTap !== null) setCoinsPerTap(storedCoinsPerTap);
    if (storedEnergyLimit !== null) setEnergyLimit(storedEnergyLimit);
    if (storedRefillRate !== null) setRefillRate(storedRefillRate);
  }, []);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  const calculateInitialEnergy = useCallback(() => {
    let storedEnergy;
    try {
      storedEnergy = JSON.parse(localStorage.getItem('energy'));
      if (storedEnergy === null || storedEnergy === undefined) {
        storedEnergy = 500;
      }
    } catch (error) {
      console.error("Error parsing energy from local storage:", error);
      storedEnergy = 500;
    }

    const lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime'), 10) || Date.now();
    const elapsedSeconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    const energyGain = Math.floor(elapsedSeconds / refillRate);
    return Math.min(storedEnergy + energyGain, energyLimit);
  }, [refillRate, energyLimit]);

  const [energy, setEnergy] = useState(calculateInitialEnergy);

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
    }, 2000),
    []
  );

  useEffect(() => {
    debouncedSaveCount(count);
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
