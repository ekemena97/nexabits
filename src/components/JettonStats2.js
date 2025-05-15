import React, { useState, useEffect } from "react";
import { useTapContext } from "../context/TapContext.js";

const JettonStats = ({ accountId, walletName }) => {
  const [data, setData] = useState(null);
  const [nftData, setNftData] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointTotal, setPointTotal] = useState(0);
  const { incrementPoints } = useTapContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://tonapi.io/v2/accounts/${accountId}/jettons`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchNftData = async () => {
      try {
        const response = await fetch(
          `https://tonapi.io/v2/accounts/${accountId}/nfts`
        );
        const result = await response.json();
        setNftData(result.nft_items);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      }
    };

    const fetchTransactionData = async () => {
      try {
        const response = await fetch(
          `https://tonapi.io/v2/accounts/${accountId}/events?limit=100`
        );
        const result = await response.json();
        setTransactionData(result.events);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    Promise.all([fetchData(), fetchNftData(), fetchTransactionData()]).then(
      () => setLoading(false)
    );
  }, [accountId]);

  useEffect(() => {
    if (data && nftData && transactionData) {
      calculateScore();
    }
  }, [data, nftData, transactionData]);

  const calculateScore = () => {
    const nonZeroBalanceTokens = data.balances.filter(
      (item) => parseFloat(item.balance) > 0
    ).length;

    const totalNFTs = nftData.length;
    const durationDays = Math.floor(
      (Date.now() - Math.min(...transactionData.map((e) => e.timestamp)) * 1000) /
        (1000 * 60 * 60 * 24)
    );

    const scamTransactions = transactionData.filter((event) => event.is_scam)
      .length;
    const totalTransactions = transactionData.length;

    // Basic scoring logic
    const score =
      50 +
      Math.min(nonZeroBalanceTokens * 10, 200) + // Weight for tokens
      Math.min(totalNFTs * 5, 150) + // Weight for NFTs
      Math.min(durationDays * 2, 300) + // Weight for account age
      Math.max(0, 100 - scamTransactions * 10) + // Deduct for scam transactions
      Math.min(totalTransactions * 2, 200); // Reward active interactions

    setPointTotal(Math.min(Math.max(score, 50), 1000));
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (!data || !nftData || !transactionData)
    return <p className="text-center text-red-500">No data available.</p>;

  // Transaction timestamps
  const timestamps = transactionData.map((event) => event.timestamp);
  const earliestTimestamp = Math.min(...timestamps);
  const firstDate = new Date(earliestTimestamp * 1000).toLocaleString();
  const durationDays = Math.floor(
    (Date.now() - earliestTimestamp * 1000) / (1000 * 60 * 60 * 24)
  );

  const durationText =
    durationDays < 366
      ? `${durationDays} days`
      : `${Math.floor(durationDays / 365)} year${
          Math.floor(durationDays / 365) > 1 ? "s" : ""
        }${
          durationDays % 365 > 0
            ? `, ${durationDays % 365} day${
                durationDays % 365 > 1 ? "s" : ""
              }`
            : ""
        }`;

  // Data analysis
  const zeroBalanceTokens = data.balances.filter(
    (item) => item.balance === "0"
  );
  const nonZeroBalanceTokens = data.balances.filter(
    (item) => parseFloat(item.balance) > 0
  );
  const scamTokens = data.balances.filter(
    (item) =>
      item.jetton.verification === "blacklist" ||
      item.jetton.verification === "none"
  );

  const suspiciousNFTs = nftData.filter(
    (nft) => !nft.verified || nft.trust === "none" || nft.owner.is_scam
  );

  const transactionStats = transactionData.length;
  const scamTransactions = transactionData.filter((event) => event.is_scam)
    .length;

  return (
    <div className="p-4 rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-[#1e2337]">Total Score: {pointTotal}</h2>
      <div className="mb-6">
        <p>
          You made your first TON transaction on{" "}
          <span className="text-[#2d83ec] font-medium">{firstDate}</span>.
        </p>
        <p>
          Wow, you've been interacting on the TON ecosystem for{" "}
          <span className="text-[#0098ea] font-medium">{durationText}</span>!
        </p>
        <p>
          Your favorite wallet is{" "}
          <b className="text-[#5a5fff]">{walletName}</b>.
        </p>
        <p>
          You currently own{" "}
          <span className="text-[#2d83ec] font-medium">
            {nonZeroBalanceTokens.length}
          </span>{" "}
          jettons with non-zero balances.
        </p>
        <p>
          You've collected{" "}
          <span className="text-[#0098ea] font-medium">
            {nftData.length} NFTs
          </span>, showcasing your creative and activity prowess on blockchain.
        </p>
        <p>
          Out of your{" "}
          <span className="text-[#2d83ec] font-medium">
            {transactionStats} transactions
          </span>, only{" "}
          <span className="text-[#fddc00] font-medium">
            {scamTransactions} were scams
          </span>
          . Keep an eye out, and continue exploring safely!
        </p>
        <p>
          {scamTokens.length > 0
            ? `Unfortunately, you've interacted with ${scamTokens.length} scam jettons. Stay cautious!`
            : "Great news! You haven't interacted with any scam jettons."}
        </p>
        <p>
          You also own{" "}
          <span className="text-[#fddc00] font-medium">
            {suspiciousNFTs.length}
          </span>{" "}
          suspicious NFTs. Double-check their legitimacy to ensure they're safe!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue/15 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg text-[#1e2337]">Token Stats</h3>
          <p className="mt-2">
            <span className="text-[#2d83ec] font-medium">Zero Balance:</span>{" "}
            {zeroBalanceTokens.length}
          </p>
          <p>
            <span className="text-[#2d83ec] font-medium">Non-Zero Balance:</span>{" "}
            {nonZeroBalanceTokens.length}
          </p>
          <p>
            <span className="text-[#fddc00] font-medium">Scam Tokens:</span>{" "}
            {scamTokens.length}
          </p>
        </div>

        <div className="bg-blue/15 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg text-[#1e2337]">NFT Stats</h3>
          <p className="mt-2">
            <span className="text-[#0098ea] font-medium">Total NFTs:</span>{" "}
            {nftData.length}
          </p>
          <p>
            <span className="text-[#fddc00] font-medium">
              Scam/Suspicious NFTs:
            </span>{" "}
            {suspiciousNFTs.length}
          </p>
        </div>

        <div className="bg-blue/15 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg text-[#1e2337]">
            Transaction Stats
          </h3>
          <p className="mt-2">
            <span className="text-[#2d83ec] font-medium">
              Total Transactions:
            </span>{" "}
            {transactionStats}
          </p>
          <p>
            <span className="text-[#fddc00] font-medium">Scam Transactions:</span>{" "}
            {scamTransactions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JettonStats;
