import React, { createContext, useContext, useState, useEffect } from "react";
import AWS from "aws-sdk";

const TapContext = createContext();

export const useTapContext = () => useContext(TapContext);

export const TapProvider = ({ children }) => {
  const [username, setUsername] = useState("defaultUser");
  const [count, setCount] = useState(0);
  // const [coinsPerTap, setCoinsPerTap] = useState(1);
  const [coinsPerTap, setCoinsPerTap] = useState(() => {
    const storedCoinsPerTap = localStorage.getItem("coinsPerTap");
    return storedCoinsPerTap ? parseInt(storedCoinsPerTap, 10) : 1;
  });
  const [energyLimit, setEnergyLimit] = useState(500);
  const [refillRate, setRefillRate] = useState(300);
  const [energy, setEnergy] = useState(500);
  const [referredUsers, setReferredUsers] = useState([]);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);

  // AWS Configuration
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  AWS.config.logger = console; // Add this line to enable logging

  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  const tableName = process.env.REACT_APP_DYNAMODB_TABLE || "TapUsers";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const params = {
          TableName: tableName,
          Key: {
            username: username,
          },
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
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    const updateUser = async () => {
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
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    };

    if (username) {
      updateUser();
    }
  }, [
    username,
    count,
    coinsPerTap,
    energyLimit,
    refillRate,
    energy,
    referredUsers,
    successfulReferrals,
  ]);

  // New add
  useEffect(() => {
    localStorage.setItem("coinsPerTap", coinsPerTap);
  }, [coinsPerTap]);

  useEffect(() => {
    const savedTime = localStorage.getItem("lastUpdateTime");
    if (savedTime) {
      const elapsedSeconds = Math.floor(
        (Date.now() - parseInt(savedTime, 10)) / 1000
      );
      const energyGain = Math.floor(elapsedSeconds / refillRate);
      setEnergy((prevEnergy) => Math.min(prevEnergy + energyGain, energyLimit));
    }
    localStorage.setItem("lastUpdateTime", Date.now());
  }, [energyLimit, refillRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy =
          prevEnergy < energyLimit ? prevEnergy + 1 : energyLimit;
        localStorage.setItem("energy", newEnergy);
        localStorage.setItem("lastUpdateTime", Date.now());
        return newEnergy;
      });
    }, (refillRate * 1000) / energyLimit);

    return () => clearInterval(interval);
  }, [energyLimit, refillRate]);

  const incrementTap = () => {
    setCount(count + coinsPerTap);
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - 1, 0);
      localStorage.setItem("energy", newEnergy);
      return newEnergy;
    });
    checkReferralSuccess();
  };

  const incrementPoints = (points) => {
    setCount((prevCount) => {
      const newCount = prevCount + points;
      localStorage.setItem("count", newCount);
      return newCount;
    });
  };

  const decrementCount = (amount) => setCount(count - amount);

  const addReferredUser = (userId) => {
    setReferredUsers((prev) => [...prev, { id: userId, success: false }]);
  };

  const checkReferralSuccess = () => {
    const referrerId = localStorage.getItem("referrerId");
    if (referrerId && count >= 100) {
      setReferredUsers((prev) =>
        prev.map((user) => {
          if (user.id === referrerId && !user.success) {
            setSuccessfulReferrals((prevCount) => prevCount + 1);
            return { ...user, success: true };
          }
          return user;
        })
      );
      localStorage.removeItem("referrerId");
    }
  };

  return (
    <TapContext.Provider
      value={{
        count,
        incrementTap,
        incrementPoints,
        coinsPerTap,
        setCoinsPerTap,
        energyLimit,
        setEnergyLimit,
        refillRate,
        setRefillRate,
        decrementCount,
        energy,
        setEnergy,
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
