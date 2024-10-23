import React, { createContext, useEffect, useState } from 'react';
import data from '../assets/data.json';

export const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
  const leaderboardLocalStorageKey = 'leaderboardData';
  const leaderboardLastUpdateKey = 'leaderboardLastUpdate';

  const loadLeaderboardData = () => {
    const storedData = localStorage.getItem(leaderboardLocalStorageKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return {
      referralContest: data.referralContest,
      contentCreatorContest: data.contentCreatorContest,
    };
  };

  const [leaderboardReferralUsers, setLeaderboardReferralUsers] = useState(loadLeaderboardData().referralContest);
  const [leaderboardContentCreatorUsers, setLeaderboardContentCreatorUsers] = useState(loadLeaderboardData().contentCreatorContest);

  // Fisher-Yates Shuffle
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const getRandomLeaderboardUsers = (users, count) => {
    const shuffledUsers = shuffleArray(users);
    return shuffledUsers.slice(0, count);
  };

  const incrementLeaderboardValues = () => {
    const selectedLeaderboardReferralUsers = getRandomLeaderboardUsers(leaderboardReferralUsers, 10);
    const selectedLeaderboardContentCreatorUsers = getRandomLeaderboardUsers(leaderboardContentCreatorUsers, 10);

    const updatedLeaderboardReferralUsers = leaderboardReferralUsers.map(user => {
      if (selectedLeaderboardReferralUsers.includes(user)) {
        return { ...user, referrals: user.referrals + Math.floor(Math.random() * 5) + 1 };
      }
      return user;
    });

    const updatedLeaderboardContentCreatorUsers = leaderboardContentCreatorUsers.map(user => {
      if (selectedLeaderboardContentCreatorUsers.includes(user)) {
        return { ...user, points: user.points + Math.floor(Math.random() * 10) + 1 };
      }
      return user;
    });

    // Sort the updated users by referrals and points
    const sortedLeaderboardReferralUsers = updatedLeaderboardReferralUsers.sort((a, b) => b.referrals - a.referrals);
    const sortedLeaderboardContentCreatorUsers = updatedLeaderboardContentCreatorUsers.sort((a, b) => b.points - a.points);

    setLeaderboardReferralUsers(sortedLeaderboardReferralUsers);
    setLeaderboardContentCreatorUsers(sortedLeaderboardContentCreatorUsers);

    // Persist the updated leaderboard data to local storage
    localStorage.setItem(
      leaderboardLocalStorageKey,
      JSON.stringify({
        referralContest: sortedLeaderboardReferralUsers,
        contentCreatorContest: sortedLeaderboardContentCreatorUsers,
      })
    );

    // Update the last leaderboard update timestamp
    localStorage.setItem(leaderboardLastUpdateKey, new Date().toISOString());
  };

  const checkForLeaderboardIncrement = () => {
    const lastLeaderboardUpdate = localStorage.getItem(leaderboardLastUpdateKey);
    if (lastLeaderboardUpdate) {
      const lastLeaderboardUpdateTime = new Date(lastLeaderboardUpdate).getTime();
      const currentLeaderboardTime = Date.now();

      // Check if 12 hours (43200000 milliseconds) have passed
      if (currentLeaderboardTime - lastLeaderboardUpdateTime >= 12 * 60 * 60 * 1000) {
        incrementLeaderboardValues();
      }
    } else {
      // If no previous update is found, do the first increment
      incrementLeaderboardValues();
    }
  };

  useEffect(() => {
    checkForLeaderboardIncrement();

    const leaderboardInterval = setInterval(() => {
      incrementLeaderboardValues();
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds

    return () => clearInterval(leaderboardInterval);
  }, [leaderboardReferralUsers, leaderboardContentCreatorUsers]);

  return (
    <LeaderboardContext.Provider value={{ leaderboardReferralUsers, leaderboardContentCreatorUsers }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export default LeaderboardProvider;
