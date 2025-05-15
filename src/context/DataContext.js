import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [nftData, setNftData] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pre-calculated values
  const [score, setScore] = useState(0);
  const [scoreDetails, setScoreDetails] = useState({
    tokensScore: 0,
    nftsScore: 0,
    ageScore: 0,
    scamDeduction: 0,
    interactionsScore: 0,
  });
  const [aggregates, setAggregates] = useState({
    nonZeroBalanceTokens: 0,
    zeroBalanceTokens: 0,
    scamTokens: 0,
    suspiciousNFTs: 0,
    scamTransactions: 0,
    totalTransactions: 0,
    durationDays: 0,
    durationText: null,
    firstTransactionDate: null,
  });

  function formatDate(date) {
    // Ensure the input is a Date object
    const validDate = new Date(date);
    if (isNaN(validDate)) {
      return "0"; // Return "0" if the date is invalid
    }

    // Helper function to add ordinal suffix
    const getOrdinal = (day) => {
      if (day > 3 && day < 21) return "th"; // 4th to 20th always "th"
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const day = validDate.getDate();
    if (day <= 0) {
      return "0"; // If day is 0, return "0"
    }

    const month = validDate.toLocaleString("default", { month: "long" }); // e.g., "February"
    const year = validDate.getFullYear();
    const time = validDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    return `${day}${getOrdinal(day)} ${month} ${year} at ${time}`;
  }


  function awardRandomWorth(character) {
    // Check if the character is valid (not null, undefined, or empty)
    if (!character || typeof character !== "string" || character.trim() === "") {
      return 0;
    }

    // Length of the string
    const length = character.length;

    // Calculate a base score inversely related to the length of the string
    let score = Math.max(10, 100 - length * 2); // Adjust multiplier to scale as needed

    // Ensure score is between 10 and 100
    score = Math.max(10, Math.min(100, score));

    // Optionally, we can add some randomness within the score range to make it dynamic
    const randomAdjustment = Math.floor(Math.random() * 21) - 10; // Random number between -10 and 10
    score += randomAdjustment;

    // Ensure final score is still within the 10 to 100 range
    score = Math.max(10, Math.min(100, score));

    return score;
  }

  function walletScore(walletName) {
    if (!walletName || typeof walletName !== "string" || walletName.trim() === "") {
      return 0; // Return 0 for null, undefined, or empty input
    }

    // Convert walletName to lowercase for case-insensitive comparison
    const lowerCaseWallet = walletName.trim().toLowerCase();

    // Determine the score based on the wallet name
    switch (lowerCaseWallet) {
      case "telegram wallet":
        return 100;
      case "tonkeeper":
        return 80;
      default:
        return 50; // Score for other wallets
    }
  }



  const fetchDataById = async (accountId) => {
    setLoading(true);
    setError(null);
    try {
      const [jettonsRes, nftsRes, transactionsRes] = await Promise.all([
        fetch(`https://tonapi.io/v2/accounts/${accountId}/jettons`),
        fetch(`https://tonapi.io/v2/accounts/${accountId}/nfts`),
        fetch(`https://tonapi.io/v2/accounts/${accountId}/events?limit=100`),
      ]);

      if (!jettonsRes.ok || !nftsRes.ok || !transactionsRes.ok) {
        throw new Error("Failed to fetch one or more resources.");
      }

      const jettons = await jettonsRes.json();
      const nfts = await nftsRes.json();
      const transactions = await transactionsRes.json();

      setData(jettons);
      setNftData(nfts.nft_items);
      setTransactionData(transactions.events);

      // Calculate aggregates and score
      calculateAggregates(jettons, nfts.nft_items, transactions.events);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const calculateAggregates = (jettons, nfts, transactions) => {
    // Token stats
    const nonZeroBalanceTokens = jettons.balances.filter(
      (item) => parseFloat(item.balance) > 0
    ).length;

    const zeroBalanceTokens = jettons.balances.filter(
      (item) => item.balance === "0"
    ).length;

    const scamTokens = jettons.balances.filter(
      (item) =>
        item.jetton.verification === "blacklist" ||
        item.jetton.verification === "none"
    ).length;

    // NFT stats
    const suspiciousNFTs = nfts.filter(
      (nft) => !nft.verified || nft.trust === "none" || nft.owner.is_scam
    ).length;

    // Transaction stats
    const scamTransactions = transactions.filter((event) => event.is_scam)
      .length;

    const totalTransactions = transactions.length;

    const timestamps = transactions.map((event) => event.timestamp);
    const earliestTimestamp = Math.min(...timestamps);
    const durationDays = Math.floor(
      (Date.now() - earliestTimestamp * 1000) / (1000 * 60 * 60 * 24)
    );

    const firstTransactionDate = new Date(earliestTimestamp * 1000).toLocaleString();

    const durationText = (() => {
      // Check if durationDays is a valid, positive number and not Infinity
      if (isNaN(durationDays) || durationDays <= 0 || !isFinite(durationDays)) {
        return "0"; // Return "0" if invalid or non-positive durationDays
      }

      // Otherwise, format the duration
      return durationDays < 366
        ? `${durationDays} day${durationDays > 1 ? "s" : ""}`
        : `${Math.floor(durationDays / 365)} year${
            Math.floor(durationDays / 365) > 1 ? "s" : ""
          }${
            durationDays % 365 > 0
              ? `, ${durationDays % 365} day${
                  durationDays % 365 > 1 ? "s" : ""
                }`
              : ""
          }`;
    })();
      

    // Calculate score components
    const tokensScore = Math.min(nonZeroBalanceTokens * 10, 1000); // Max: 1000
    const nftsScore = Math.min(nfts.length * 10, 750);              // Max: 750
    const ageScore = Math.min(durationDays * 50, 1000);            // Max: 1000
    const scamDeduction = Math.max(0, 100 - scamTransactions * 10); // Min: 0
    const interactionsScore = Math.min(totalTransactions * 30, 1500); // Max: 1500
    const totalTransactionsScore = Math.min(totalTransactions * 100, 2000); // Max: 2000

    // Calculate total score
    const totalScore = Math.min(
      Math.max(
        50, // Minimum score
        50 + tokensScore + nftsScore + ageScore + scamDeduction + interactionsScore + totalTransactionsScore
      ),
      7000 // Updated maximum score
    );

    setAggregates({
      nonZeroBalanceTokens,
      zeroBalanceTokens,
      scamTokens,
      suspiciousNFTs,
      scamTransactions,
      totalTransactions,
      durationDays,
      durationText,
      firstTransactionDate,
    });

    setScoreDetails({
      tokensScore,
      nftsScore,
      ageScore,
      scamDeduction,
      interactionsScore,
      totalTransactionsScore,    
    });

    setScore(totalScore);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        nftData,
        transactionData,
        fetchDataById,
        loading,
        error,
        score,
        scoreDetails,
        aggregates,
        formatDate,
        awardRandomWorth,
        walletScore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
