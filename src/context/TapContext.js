import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const [username, setUsername] = useState('defaultUser');
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

  const fetchUser = async () => {
    try {
      const params = {
        TableName: tableName,
        Key: { username: username },
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
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateUser = async () => {
    if (!stateChanged.current) return;

    try {
      const params = {
        TableName: tableName,
        Item: {
          username: username,
          count: count,
          coinsPerTap: coinsPerTap,
          energyLimit: energyLimit,
          refillRate: refillRate,
          energy: energy,
          referredUsers: referredUsers,
          successfulReferrals: successfulReferrals,
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
  }, [username]);

  useEffect(() => {
    const interval = setInterval(updateUser, 10 * 60 * 1000); // 10 minutes

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

  const saveStateToLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
    stateChanged.current = true;
  };

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
    return () => {
      localStorage.clear();
      setCount(0);
      setCoinsPerTap(1);
      setEnergyLimit(500);
      setRefillRate(300);
      setEnergy(500);
      setReferredUsers([]);
      setSuccessfulReferrals(0);
    };
  }, []);

  const incrementTap = () => {
    setCount(prevCount => {
      const newCount = prevCount + coinsPerTap;
      saveStateToLocalStorage('count', newCount);
      return newCount;
    });
    setEnergy(prevEnergy => {
      const newEnergy = Math.max(prevEnergy - 1, 0);
      saveStateToLocalStorage('energy', newEnergy);
      return newEnergy;
    });
    checkReferralSuccess();
  };

  const incrementPoints = (points) => {
    setCount(prevCount => {
      const newCount = prevCount + points;
      saveStateToLocalStorage('count', newCount);
      return newCount;
    });
  };

  const decrementCount = (amount) => {
    setCount(prevCount => {
      const newCount = prevCount - amount;
      saveStateToLocalStorage('count', newCount);
      return newCount;
    });
  };

  const addReferredUser = (userId) => {
    setReferredUsers(prev => {
      const newReferredUsers = [...prev, { id: userId, success: false }];
      saveStateToLocalStorage('referredUsers', JSON.stringify(newReferredUsers));
      return newReferredUsers;
    });
  };

  const checkReferralSuccess = () => {
    const referrerId = localStorage.getItem('referrerId');
    if (referrerId && count >= 100) {
      setReferredUsers(prev => {
        const newReferredUsers = prev.map(user => {
          if (user.id === referrerId && !user.success) {
            setSuccessfulReferrals(prevCount => {
              const newCount = prevCount + 1;
              saveStateToLocalStorage('successfulReferrals', newCount);
              return newCount;
            });
            return { ...user, success: true };
          }
          return user;
        });
        saveStateToLocalStorage('referredUsers', JSON.stringify(newReferredUsers));
        return newReferredUsers;
      });
      localStorage.removeItem('referrerId');
    }
  };

  return (
    <TapContext.Provider
      value={{
        count,
        incrementTap,
        incrementPoints,
        coinsPerTap,
        setCoinsPerTap: (value) => { setCoinsPerTap(value); saveStateToLocalStorage('coinsPerTap', value); },
        energyLimit,
        setEnergyLimit: (value) => { setEnergyLimit(value); saveStateToLocalStorage('energyLimit', value); },
        refillRate,
        setRefillRate: (value) => { setRefillRate(value); saveStateToLocalStorage('refillRate', value); },
        decrementCount,
        energy,
        setEnergy: (value) => { setEnergy(value); saveStateToLocalStorage('energy', value); },
        referredUsers,
        addReferredUser,
        checkReferralSuccess,
        successfulReferrals,
      }}
    >
      {children}
    </TapContext.Provider>
  );
};
