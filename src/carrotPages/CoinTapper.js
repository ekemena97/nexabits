import React, { useState, useEffect, useRef } from 'react';
import coinIcon from '../assets/coin.png'; // Adjust the path based on your project structure

const MAX_LOADER = 500;
const RECHARGE_INTERVAL = 300000; // 5 minutes in milliseconds
const RECHARGE_DELAY = 2000; // 2 seconds in milliseconds
const RECHARGE_RATE = RECHARGE_INTERVAL / MAX_LOADER;
const LOADER_KEY = 'RechargeLoader';
const LAST_TIME_KEY = 'RechargeLastTime';

const CoinTapper = () => {
  const [loader, setLoader] = useState(() => {
    const savedLoader = localStorage.getItem(LOADER_KEY);
    return savedLoader !== null ? JSON.parse(savedLoader) : MAX_LOADER;
  });
  const [isLoading, setIsLoading] = useState(true);

  const rechargeTimer = useRef(null);
  const delayTimer = useRef(null);

  useEffect(() => {
    const onTelegramReady = () => {
      const savedTime = localStorage.getItem(LAST_TIME_KEY);
      console.log('Initial load:', { savedTime });

      if (savedTime !== null) {
        const timeAway = Date.now() - JSON.parse(savedTime);
        console.log('Time away:', timeAway);

        const rechargeAmount = Math.floor(timeAway / RECHARGE_RATE);
        const newLoader = Math.min(loader + rechargeAmount, MAX_LOADER);
        console.log('Recharge amount:', rechargeAmount, 'New loader:', newLoader);

        setLoader(newLoader);
      }

      setIsLoading(false);
    };

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      onTelegramReady();
      window.Telegram.WebApp.onEvent('close', () => {
        console.log('The user has closed the app or left it entirely.');
        saveState();
      });
    } else {
      onTelegramReady();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveState();
      } else {
        const savedLoader = localStorage.getItem(LOADER_KEY);
        const savedTime = localStorage.getItem(LAST_TIME_KEY);

        if (savedLoader !== null && savedTime !== null) {
          const timeAway = Date.now() - JSON.parse(savedTime);
          const rechargeAmount = Math.floor(timeAway / RECHARGE_RATE);
          const newLoader = Math.min(JSON.parse(savedLoader) + rechargeAmount, MAX_LOADER);
          setLoader(newLoader);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rechargeTimer.current) {
        clearInterval(rechargeTimer.current);
      }
      if (delayTimer.current) {
        clearTimeout(delayTimer.current);
      }
      saveState();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (loader < MAX_LOADER && !rechargeTimer.current && !delayTimer.current) {
      startRechargingWithDelay();
    }
  }, [loader]);

  useEffect(() => {
    const saveStateOnUnload = () => {
      saveState();
    };

    window.addEventListener('beforeunload', saveStateOnUnload);

    return () => {
      window.removeEventListener('beforeunload', saveStateOnUnload);
    };
  }, [loader]);

  const startRechargingWithDelay = () => {
    delayTimer.current = setTimeout(() => {
      startRecharging();
      clearTimeout(delayTimer.current);
      delayTimer.current = null;
    }, RECHARGE_DELAY);
  };

  const startRecharging = () => {
    rechargeTimer.current = setInterval(() => {
      setLoader((prevLoader) => {
        if (prevLoader < MAX_LOADER) {
          return prevLoader + 1;
        } else {
          clearInterval(rechargeTimer.current);
          rechargeTimer.current = null;
          return MAX_LOADER;
        }
      });
    }, RECHARGE_RATE);
  };

  const handleTap = () => {
    if (loader > 0) {
      setLoader(loader - 1);
    }
    if (rechargeTimer.current || delayTimer.current) {
      clearInterval(rechargeTimer.current);
      clearTimeout(delayTimer.current);
      rechargeTimer.current = null;
      delayTimer.current = null;
    }
  };

  const saveState = () => {
    console.log('Saving state:', { loader, time: Date.now() });
    localStorage.setItem(LOADER_KEY, JSON.stringify(loader));
    localStorage.setItem(LAST_TIME_KEY, JSON.stringify(Date.now()));
  };

  const getRechargeProgress = () => {
    return (loader / MAX_LOADER) * 100;
  };

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div style={styles.loaderText}>Loading...</div>
      ) : (
        <>
          <div style={styles.loaderContainer}>
            <div style={styles.loaderText}>Loader: {loader}</div>
            <div style={styles.progressBarContainer}>
              <div style={{ ...styles.progressBar, width: `${getRechargeProgress()}%` }}></div>
            </div>
          </div>
          <button
            style={{ ...styles.coinButton, ...(loader === 0 ? styles.disabledButton : {}) }}
            onClick={handleTap}
            disabled={loader === 0}
          >
            <img src={coinIcon} alt="Coin" style={styles.coinIcon} />
          </button>
          <div style={styles.extraContent}>
            <p>Scroll down to see more content and the recharging in action...</p>
            {[...Array(50)].map((_, i) => (
              <p key={i}>This is extra content to make the page longer. Line {i + 1}.</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200vh',
    padding: '20px',
    backgroundColor: '#000',
    color: '#fff',
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  loaderText: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  progressBarContainer: {
    width: '80%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: '10px',
    transition: 'width 0.3s ease-in-out',
  },
  coinButton: {
    fontSize: '20px',
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: '#ffc107',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    cursor: 'not-allowed',
  },
  coinIcon: {
    width: '50px',
    height: '50px',
  },
  extraContent: {
    marginTop: '40px',
    textAlign: 'center',
  },
};

export default CoinTapper;
