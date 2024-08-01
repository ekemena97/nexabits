import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTapContext } from './TapContext.js';

const TreasureContext = createContext();

export const useTreasureContext = () => {
  return useContext(TreasureContext);
};

export const TreasureProvider = ({ children }) => {
  const {
    coinsPerTap,
    setCoinsPerTap,
    energyLimit,
    setEnergyLimit,
    refillRate,
    setRefillRate,
    updateStateAndStorage,
  } = useTapContext();

  const [treasurePoints, setTreasurePoints] = useState(() => {
    const savedPoints = localStorage.getItem('treasurePoints');
    return savedPoints ? JSON.parse(savedPoints) : 0;
  });

  const [upgradeLevel, setUpgradeLevel] = useState(() => {
    const savedLevel = localStorage.getItem('upgradeLevel');
    return savedLevel ? JSON.parse(savedLevel) : 0;
  });

  const prevValues = useRef({
    coinsPerTap,
    energyLimit,
    refillRate,
  });

  useEffect(() => {
    const prev = prevValues.current;
    const updateStateAndStorageAsync = async (key, value, setState) => {
      await updateStateAndStorage(key, value, setState);
    };
    if (prev.coinsPerTap !== coinsPerTap) {
      updateStateAndStorageAsync('coinsPerTap', coinsPerTap, setCoinsPerTap);
    }
    if (prev.energyLimit !== energyLimit) {
      updateStateAndStorageAsync('energyLimit', energyLimit, setEnergyLimit);
    }
    if (prev.refillRate !== refillRate) {
      updateStateAndStorageAsync('refillRate', refillRate, setRefillRate);
    }
    prevValues.current = { coinsPerTap, energyLimit, refillRate };
  }, [coinsPerTap, energyLimit, refillRate, updateStateAndStorage, setCoinsPerTap, setEnergyLimit, setRefillRate]);

  useEffect(() => {
    localStorage.setItem('treasurePoints', JSON.stringify(treasurePoints));
    localStorage.setItem('upgradeLevel', JSON.stringify(upgradeLevel));
  }, [treasurePoints, upgradeLevel]);

  const addTreasurePoint = () => {
    setTreasurePoints(prevTreasurePoints => prevTreasurePoints + 1);
  };

  const checkForUpgrades = useCallback((points) => {
    const upgrades = [
      { cost: 20, setValue: setCoinsPerTap, newValue: 2 },
      { cost: 50, setValue: setEnergyLimit, newValue: 1000 },
      { cost: 100, setValue: setCoinsPerTap, newValue: 3 },
      { cost: 300, setValue: setEnergyLimit, newValue: 1500 },
      { cost: 500, setValue: setCoinsPerTap, newValue: 4 },
      { cost: 2000, setValue: setEnergyLimit, newValue: 2000 },
      { cost: 5000, setValue: setCoinsPerTap, newValue: 5 },
      { cost: 15000, setValue: setEnergyLimit, newValue: 2500 },
      { cost: 30000, setValue: setCoinsPerTap, newValue: 6 },
      { cost: 50000, setValue: setEnergyLimit, newValue: 3000 },
    ];

    const randomBalance = Math.floor(Math.random() * 10) + 1;
    const upgrade = upgrades[upgradeLevel];
    if (upgrade && points >= upgrade.cost + randomBalance) { // Ensure balance of at least randomBalance
      upgrade.setValue(upgrade.newValue);
      setTreasurePoints(points - upgrade.cost);
      setUpgradeLevel(prevLevel => prevLevel + 1);
    }
  }, [setCoinsPerTap, setEnergyLimit, upgradeLevel]);

  useEffect(() => {
    checkForUpgrades(treasurePoints);
  }, [treasurePoints, checkForUpgrades]);

  return (
    <TreasureContext.Provider value={{ treasurePoints, addTreasurePoint }}>
      {children}
    </TreasureContext.Provider>
  );
};

export default TreasureProvider;
