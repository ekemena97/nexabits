import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AWS from 'aws-sdk';

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [coinsPerTap, setCoinsPerTap] = useState(1);
  const [energyLimit, setEnergyLimit] = useState(500);
  const [refillRate, setRefillRate] = useState(300);
  const [energy, setEnergy] = useState(500);
  const [referredUsers, setReferredUsers] = useState([]);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);

  const stateChanged = useRef(false);

  // AWS Configuration
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  const tableName = process.env.REACT_APP_DYNAMODB_TABLE || 'TapUsers';

  // Utility function to update state and local storage
  const updateStateAndLocalStorage = useCallback((key, value, setState) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
    stateChanged.current = true;
  }, []);

  // Generate or retrieve the persistent unique ID
  const getUniqueId = () => {
    let uniqueId = localStorage.getItem('uniqueId');
    if (!uniqueId) {
      uniqueId = Math.floor(100000000 + Math.random() * 900000000).toString();
      localStorage.setItem('uniqueId', uniqueId);
    }
    return uniqueId;
  };

  const uniqueId = getUniqueId();

  // Utility function to generate a unique referral link
  const generateUniqueReferralLink = (uniqueId) => {
    const baseUrl = "https://t.me/TapLengendBot/start?startapp=";
    const referralText = `🎁 New and Hot! First Time Gift for Playing with Me\n💵 5K $Squad tokens as a first-time gift.`;
    return {
      link: `${baseUrl}${uniqueId}`,
      textLink: `${baseUrl}${uniqueId}&text=${encodeURIComponent(referralText)}`,
    };
  };

  const fetchUser = async () => {
    try {
      const params = {
        TableName: tableName,
        Key: { username: uniqueId },
      };
      const response = await dynamoDB.get(params).promise();
      const user = response.Item || {};
      setCount(user.count || 0);
      setCoinsPerTap(user.coinsPerTap || 1);
      setEnergyLimit(user.energyLimit || 500);
      setRefillRate(user.refillRate || 300);
      setEnergy(user.energy || user.energyLimit || 500);
      setReferredUsers(user.referredUsers || []);
      setSuccessfulReferrals(user.successfulReferrals || 0);
      if (user.startappId) {
        localStorage.setItem('startappId', user.startappId);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateUser = async () => {
    if (!stateChanged.current) return;

    try {
      const startappId = localStorage.getItem('startappId');
      const params = {
        TableName: tableName,
        Item: {
          username: uniqueId,
          count: count,
          coinsPerTap: coinsPerTap,
          energyLimit: energyLimit,
          refillRate: refillRate,
          energy: energy,
          referredUsers: referredUsers,
          successfulReferrals: successfulReferrals,
          startappId: startappId,
        },
      };
      await dynamoDB.put(params).promise();
      stateChanged.current = false;
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [uniqueId]);

  useEffect(() => {
    const interval = setInterval(updateUser, 1 * 60 * 1000); // upload to database every 1 minute

    return () => clearInterval(interval);
  }, [count, coinsPerTap, energyLimit, refillRate, energy, referredUsers, successfulReferrals]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      await updateUser();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [count, coinsPerTap, energyLimit, refillRate, energy, referredUsers, successfulReferrals]);

  useEffect(() => {
    const savedTime = localStorage.getItem("lastUpdateTime");
    if (savedTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTime, 10)) / 1000);
      const energyGain = Math.floor(elapsedSeconds / refillRate);
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
    }, refillRate * 1000 / energyLimit);

    return () => clearInterval(interval);
  }, [energyLimit, refillRate]);

  useEffect(() => {
    const startappId = new URLSearchParams(window.location.search).get('startapp');
    if (startappId) {
      localStorage.setItem('startappId', startappId);
      stateChanged.current = true; // Mark state as changed to trigger updateUser
      console.log(`startappId set in localStorage: ${startappId}`);
    } else {
      console.log("startappId not found in URL");
    }
  }, []);

  const incrementTap = () => {
    setCount(prevCount => {
      const newCount = prevCount + coinsPerTap;
      updateStateAndLocalStorage('count', newCount, setCount);
      return newCount;
    });
    setEnergy(prevEnergy => {
      const newEnergy = Math.max(prevEnergy - 1, 0);
      updateStateAndLocalStorage('energy', newEnergy, setEnergy);
      return newEnergy;
    });
    checkReferralSuccess();
  };

  const incrementPoints = (points) => {
    setCount(prevCount => {
      const newCount = prevCount + points;
      updateStateAndLocalStorage('count', newCount, setCount);
      return newCount;
    });
  };

  const decrementCount = (amount) => {
    setCount(prevCount => {
      const newCount = prevCount - amount;
      updateStateAndLocalStorage('count', newCount, setCount);
      return newCount;
    });
  };

  const addReferredUser = (userId) => {
    console.log(`Adding referred user: ${userId}`);
    setReferredUsers(prev => {
      const newReferredUsers = [...prev, { id: userId, success: false }];
      updateStateAndLocalStorage('referredUsers', newReferredUsers, setReferredUsers);
      return newReferredUsers;
    });
  };

  const checkReferralSuccess = () => {
    const startappId = localStorage.getItem('startappId');
    console.log(`Checking referral success for: ${startappId} with count: ${count}`);
    if (startappId && count >= 100) {
      setReferredUsers(prev => {
        const newReferredUsers = prev.map(user => {
          if (user.id === startappId && !user.success) {
            setSuccessfulReferrals(prevCount => {
              const newCount = prevCount + 1;
              updateStateAndLocalStorage('successfulReferrals', newCount, setSuccessfulReferrals);
              console.log(`Incrementing successful referrals: ${newCount}`);
              return newCount;
            });
            return { ...user, success: true };
          }
          return user;
        });
        updateStateAndLocalStorage('referredUsers', newReferredUsers, setReferredUsers);
        return newReferredUsers;
      });
      localStorage.removeItem('startappId');
    } else {
      console.log("Referral success criteria not met or startappId not found");
    }
  };

  useEffect(() => {
    checkReferralSuccess();
  }, [count]);

  return (
    <TapContext.Provider
      value={{
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
        referredUsers,
        addReferredUser,
        checkReferralSuccess,
        successfulReferrals,
        generateUniqueReferralLink, // Exporting the function
      }}
    >
      {children}
    </TapContext.Provider>
  );
};
