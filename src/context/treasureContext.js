import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTapContext } from './TapContext.js';

const TreasureContext = createContext();

export const useTreasureContext = () => {
  return useContext(TreasureContext);
};

export const TreasureProvider = ({ children }) => {
  const { updateStateAndStorage } = useTapContext();

  const [treasurePoints, setTreasurePoints] = useState(() => {
    const savedPoints = localStorage.getItem('treasurePoints');
    return savedPoints ? JSON.parse(savedPoints) : 0;
  });

  useEffect(() => {
    localStorage.setItem('treasurePoints', JSON.stringify(treasurePoints));
  }, [treasurePoints]);

  const addTreasurePoint = () => {
    setTreasurePoints(prevTreasurePoints => prevTreasurePoints + 1);
  };

  return (
    <TreasureContext.Provider value={{ treasurePoints, addTreasurePoint }}>
      {children}
    </TreasureContext.Provider>
  );
};

export default TreasureProvider;
