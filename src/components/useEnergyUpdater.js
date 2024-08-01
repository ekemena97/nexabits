import { useEffect, useCallback } from 'react';

const getStorageItem = (key) => {
  return new Promise((resolve, reject) => {
    window.Telegram.WebApp.CloudStorage.getItem(key, (err, value) => {
      if (err || !value) {
        return reject(new Error(`Data not stored for key: ${key}`));
      }
      resolve(value);
    });
  });
};

const setStorageItem = (key, value) => {
  window.Telegram.WebApp.CloudStorage.setItem(key, JSON.stringify(value));
};

const useEnergyUpdater = (setEnergy, energyLimit, refillRate) => {
  const calculateEnergyGain = useCallback(async () => {
    const lastUpdateTime = parseInt(await getStorageItem('lastUpdateTime'), 10) || Date.now();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);
    const energyGain = Math.floor(elapsedSeconds / refillRate);

    return { energyGain, elapsedSeconds, currentTime };
  }, [refillRate]);

  const applyEnergyGain = useCallback(async () => {
    const { energyGain, elapsedSeconds, currentTime } = await calculateEnergyGain();
    setEnergy(prevEnergy => {
      const newEnergy = Math.min(prevEnergy + energyGain, energyLimit);
      setStorageItem('lastUpdateTime', currentTime.toString());
      console.log(`Applying energy gain: ${energyGain}, new energy: ${newEnergy}`);
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
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          handleWebAppOpen();
        }
      });

      return () => {
        telegram.offEvent('web_app_close', handleWebAppClose);
        document.removeEventListener('visibilitychange', handleWebAppOpen);
      };
    }
  }, [applyEnergyGain]);
};

export default useEnergyUpdater;
