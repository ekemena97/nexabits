import React, { createContext, useContext, useState, useEffect } from 'react';

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem('count');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const [coinsPerTap, setCoinsPerTap] = useState(() => {
    const savedCoinsPerTap = localStorage.getItem('coinsPerTap');
    return savedCoinsPerTap ? parseInt(savedCoinsPerTap, 10) : 1;
  });
  const [energyLimit, setEnergyLimit] = useState(() => {
    const savedEnergyLimit = localStorage.getItem('energyLimit');
    return savedEnergyLimit ? parseInt(savedEnergyLimit, 10) : 500;
  });
  const [refillRate, setRefillRate] = useState(() => {
    const savedRefillRate = localStorage.getItem('refillRate');
    return savedRefillRate ? parseInt(savedRefillRate, 10) : 300; // 5 minutes by default
  });
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy !== null ? parseInt(savedEnergy, 10) : energyLimit;
  });

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  useEffect(() => {
    localStorage.setItem('coinsPerTap', coinsPerTap);
  }, [coinsPerTap]);

  useEffect(() => {
    localStorage.setItem('energyLimit', energyLimit);
  }, [energyLimit]);

  useEffect(() => {
    localStorage.setItem('refillRate', refillRate);
  }, [refillRate]);

  useEffect(() => {
    localStorage.setItem('energy', energy);
  }, [energy]);

  useEffect(() => {
    const savedTime = localStorage.getItem("lastUpdateTime");
    if (savedTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTime, 10)) / 1000);
      const energyGain = Math.floor(elapsedSeconds / refillRate); // Calculate based on refill rate
      setEnergy((prevEnergy) => Math.min(prevEnergy + energyGain, energyLimit));
    }
    localStorage.setItem("lastUpdateTime", Date.now());
  }, [energyLimit, refillRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = prevEnergy < energyLimit ? prevEnergy + 1 : energyLimit;
        localStorage.setItem("energy", newEnergy);
        localStorage.setItem("lastUpdateTime", Date.now());
        return newEnergy;
      });
    }, refillRate * 1000 / energyLimit); // Adjust interval based on refill rate

    return () => clearInterval(interval);
  }, [energyLimit, refillRate]);

  const incrementTap = () => {
    setCount(count + coinsPerTap);
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - 1, 0);
      localStorage.setItem("energy", newEnergy);
      return newEnergy;
    });
  };

  const incrementPoints = (points) => {
    setCount((prevCount) => {
      const newCount = prevCount + points;
      localStorage.setItem('count', newCount);
      return newCount;
    });
  };

  const decrementCount = (amount) => setCount(count - amount);

  return (
    <TapContext.Provider value={{ count, incrementTap, incrementPoints, coinsPerTap, setCoinsPerTap, energyLimit, setEnergyLimit, refillRate, setRefillRate, decrementCount, energy, setEnergy }}>
      {children}
    </TapContext.Provider>
  );
};
