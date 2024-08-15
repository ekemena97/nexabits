import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useTelegramUser } from "./TelegramContext.js";
import { getStorageItem, setStorageItem } from "../components/storageHelpers.js"; 

const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  const [referredUsers, setReferredUsers] = useState([]);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [ordinaryReferredUsers, setOrdinaryReferredUsers] = useState(0);
  const [premiumReferredUsers, setPremiumReferredUsers] = useState(0);

  const userId = useTelegramUser();

  const fetchData = useCallback(async () => {
    if (userId) {
      try {
        const storedOrdinaryCount = (await getStorageItem('prevOrdinaryReferredUsers')) || 0;
        const storedPremiumCount = (await getStorageItem('prevPremiumReferredUsers')) || 0;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/checkref?userId=${userId}`);
        const data = await response.json();

        setReferredUsers(data.referredUsersDetails);
        setTotalReferrals(data.totalReferrals);
        setSuccessfulReferrals(data.successfulReferralsCount);
        setOrdinaryReferredUsers(data.ordinaryReferredUsersCount);
        setPremiumReferredUsers(data.premiumReferredUsersCount);

        const newOrdinaryReferredUsers = data.ordinaryReferredUsersCount - storedOrdinaryCount;
        const newPremiumReferredUsers = data.premiumReferredUsersCount - storedPremiumCount;

        const ordinaryBonus = newOrdinaryReferredUsers > 0 ? newOrdinaryReferredUsers * 5000 : 0;
        const premiumBonus = newPremiumReferredUsers > 0 ? newPremiumReferredUsers * 10000 : 0;
        const totalBonus = ordinaryBonus + premiumBonus;

        if (totalBonus > 0) {
          await setStorageItem('prevOrdinaryReferredUsers', data.ordinaryReferredUsersCount);
          await setStorageItem('prevPremiumReferredUsers', data.premiumReferredUsersCount);
          console.log(`Incremented points by ${totalBonus} for new referrals.`);
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contextValue = useMemo(() => ({
    referredUsers, 
    totalReferrals, 
    successfulReferrals, 
    ordinaryReferredUsers, 
    premiumReferredUsers 
  }), [
    referredUsers, 
    totalReferrals, 
    successfulReferrals, 
    ordinaryReferredUsers, 
    premiumReferredUsers
  ]);

  return (
    <ReferralContext.Provider value={contextValue}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferralContext = () => useContext(ReferralContext);
