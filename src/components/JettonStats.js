import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext.js";
import { useTapContext } from "../context/TapContext.js";

const JettonStats = ({ accountId, walletName }) => {
  const { fetchDataById, loading, error, score, scoreDetails, aggregates, nftData } = useDataContext();
  const { incrementPoints } = useTapContext();

  useEffect(() => {
    fetchDataById(accountId);
  }, [accountId, fetchDataById]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (error)
    return (
      <p className="text-center text-red-500">
        Error: {error}. Please try again later.
      </p>
    );

  const {
    nonZeroBalanceTokens,
    zeroBalanceTokens,
    scamTokens,
    suspiciousNFTs,
    scamTransactions,
    totalTransactions,
    durationDays,
    durationText,
    firstTransactionDate,
  } = aggregates;

  const {
    tokensScore,
    nftsScore,
    ageScore,
    scamDeduction,
    interactionsScore,
  } = scoreDetails;  

  return (
    <div className="p-4 rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-[#1e2337]">Total Score: {score}</h2>
      <div className="mb-6">
        <p>
          You made your first TON transaction on{" "}
          <span className="text-[#2d83ec] font-medium">{firstTransactionDate}</span>.
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
          You own{" "}
          <span className="text-[#2d83ec] font-medium">
            {nonZeroBalanceTokens}
          </span>{" "}
          jettons with non-zero balances.
        </p>
        <p>
          You've collected{" "}
          <span className="text-[#0098ea] font-medium">{nftData.length} NFTs</span>, showcasing your
          creative and activity prowess on blockchain.
        </p>
        <p>
          Out of your{" "}
          <span className="text-[#2d83ec] font-medium">{totalTransactions} transactions</span>, only{" "}
          <span className="text-[#fddc00] font-medium">{scamTransactions} were scams</span>. Keep an
          eye out, and continue exploring safely!
        </p>
        <p>
          {scamTokens > 0
            ? `Unfortunately, you've interacted with ${scamTokens} scam jettons. Stay cautious!`
            : "Great news! You haven't interacted with any scam jettons."}
        </p>
        <p>
          You also own{" "}
          <span className="text-[#fddc00] font-medium">{suspiciousNFTs}</span>{" "}
          suspicious NFTs. Double-check their legitimacy to ensure they're safe!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue/15 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg text-[#1e2337]">Token Stats</h3>
          <p className="mt-2">
            <span className="text-[#2d83ec] font-medium">Zero Balance:</span>{" "}
            {zeroBalanceTokens}
          </p>
          <p>
            <span className="text-[#2d83ec] font-medium">Non-Zero Balance:</span>{" "}
            {nonZeroBalanceTokens}
          </p>
          <p>
            <span className="text-[#fddc00] font-medium">Scam Tokens:</span>{" "}
            {scamTokens}
          </p>
        </div>

        <div className="bg-blue/15 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg text-[#1e2337]">NFT Stats</h3>
          <p className="mt-2">
            <span className="text-[#0098ea] font-medium">Total NFTs:</span>{" "}
            {nftData?.length}
          </p>
          <p>
            <span className="text-[#fddc00] font-medium">
              Scam/Suspicious NFTs:
            </span>{" "}
            {suspiciousNFTs}
          </p>
        </div>

        <div className="bg-blue/15 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg text-[#1e2337]">
            Transaction Stats
          </h3>
          <p className="mt-2">
            <span className="text-[#2d83ec] font-medium">Total Transactions:</span>{" "}
            {totalTransactions}
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
