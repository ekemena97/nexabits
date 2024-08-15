import { useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../components/storageHelpers.js';

const useEnergyUpdater = (setEnergy, energyLimit, refillRate) => {
  const calculateEnergyGain = useCallback(async () => {
    const lastUpdateTime = parseInt(await getStorageItem('lastUpdateTime'), 10) || Date.now();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);
    const energyGain = Math.floor(elapsedSeconds / refillRate);

    return { energyGain, currentTime };
  }, [refillRate]);

  const applyEnergyGain = useCallback(async () => {
    const { energyGain, currentTime } = await calculateEnergyGain();
    setEnergy(prevEnergy => {
      const newEnergy = Math.min(prevEnergy + energyGain, energyLimit);
      setStorageItem('lastUpdateTime', currentTime.toString());
      setStorageItem('energy', newEnergy); // Store energy in storage
      return newEnergy;
    });
  }, [calculateEnergyGain, energyLimit, setEnergy]);

  useEffect(() => {
    applyEnergyGain();

    const interval = setInterval(() => {
      applyEnergyGain();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [applyEnergyGain]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        applyEnergyGain();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [applyEnergyGain]);

  useEffect(() => {
    const handleWebAppClose = () => {
      setStorageItem('lastUpdateTime', Date.now().toString());
    };

    const handleWebAppOpen = () => {
      applyEnergyGain();
    };

    if (window.Telegram) {
      const telegram = window.Telegram.WebApp;

      telegram.onEvent('web_app_close', handleWebAppClose);
      telegram.onEvent('web_app_open', handleWebAppOpen);

      return () => {
        telegram.offEvent('web_app_close', handleWebAppClose);
        telegram.offEvent('web_app_open', handleWebAppOpen);
      };
    }
  }, [applyEnergyGain]);
};

export default useEnergyUpdater;
