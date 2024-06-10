import React, { createContext, useContext, useState } from 'react';

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [coinsPerTap, setCoinsPerTap] = useState(1);
  const [energyLimit, setEnergyLimit] = useState(500); // Initial energy limit value
  const [refillRate, setRefillRate] = useState(10); // Initial refill rate value

  const incrementTap = () => setCount(count + coinsPerTap);
  const decrementCount = (amount) => setCount(count - amount);

  return (
    <TapContext.Provider value={{ count, incrementTap, coinsPerTap, setCoinsPerTap, energyLimit, setEnergyLimit, refillRate, setRefillRate, decrementCount }}>
      {children}
    </TapContext.Provider>
  );
};
