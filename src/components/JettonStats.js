import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const JettonStats = ({ accountId, walletName }) => {
  const [data, setData] = useState(null);
  const [nftData, setNftData] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nftLoading, setNftLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://tonapi.io/v2/accounts/${accountId}/jettons`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchNftData = async () => {
      try {
        const response = await fetch(`https://tonapi.io/v2/accounts/${accountId}/nfts`);
        const result = await response.json();
        setNftData(result.nft_items);
        setNftLoading(false);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        setNftLoading(false);
      }
    };

    const fetchTransactionData = async () => {
      try {
        const response = await fetch(`https://tonapi.io/v2/accounts/${accountId}/events?limit=100`);
        const result = await response.json();
        setTransactionData(result.events);
        setTransactionLoading(false);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setTransactionLoading(false);
      }
    };

    fetchData();
    fetchNftData();
    fetchTransactionData();
  }, [accountId]);

  if (loading || nftLoading || transactionLoading) return <p>Loading...</p>;
  if (!data || !nftData || !transactionData) return <p>No data available.</p>;

  // Get first and last transaction timestamps
  const timestamps = transactionData.map(event => event.timestamp);
  const earliestTimestamp = Math.min(...timestamps);
  const latestTimestamp = Math.max(...timestamps);
  const firstDate = new Date(earliestTimestamp * 1000).toLocaleString();
  
  // Calculate duration
  const durationMs = (latestTimestamp - earliestTimestamp) * 1000;
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const durationText = durationDays > 1 ? `${durationDays} days` : "1 day";

  const getEventDetails = (data) => {
    const totalEventIds = data.reduce((count, event) => count + (event.event_id ? 1 : 0), 0);
    const totalScamEvents = data.filter(event => event.is_scam === true).length;
    return { totalTransactions: totalEventIds, scamTransactions: totalScamEvents };
  };

  const { totalTransactions, scamTransactions } = getEventDetails(transactionData);

  const zeroBalanceTokens = data.balances.filter(item => item.balance === "0");
  const nonZeroBalanceTokens = data.balances.filter(item => parseFloat(item.balance) > 0);
  const scamTokens = data.balances.filter(
    item => item.jetton.verification === "blacklist" || item.jetton.verification === "none"
  );

  const goodNFTs = nftData.filter(nft => nft.verified && nft.trust !== "none");
  const suspiciousPatterns = [
    /https?:\/\/[^\s]+/i,
    /(?:\w+\.\w+)/i,
    /tgspin[^\s]*/i
  ];
  const suspiciousNFTs = nftData.filter(nft =>
    !nft.verified || nft.trust === "none" || nft.owner.is_scam || suspiciousPatterns.some(pattern => pattern.test(nft.metadata.description))
  );

  const renderTokens = tokens => (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      {tokens.map(token => (
        <div key={token.jetton.address} style={{ fontSize: "5px", display: "flex", alignItems: "center" }}>
          <img src={token.jetton.image} alt={token.jetton.symbol} style={{ width: "7px", height: "7px", marginRight: "2px" }} />
          <span>{token.jetton.symbol}</span>
        </div>
      ))}
    </div>
  );

  const renderNFTs = nfts => (
    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
      {nfts.map((nft, index) => {
        const isGoodNFT = nft.verified && nft.trust !== "none";
        return (
          <div key={index} style={{ position: 'relative' }}>
            {isGoodNFT && (
              <FaCheckCircle style={{ position: 'absolute', top: '0', left: '0', color: 'green', fontSize: '15px' }} />
            )}
            {!isGoodNFT && (
              <FaExclamationTriangle style={{ position: 'absolute', top: '0', left: '0', color: 'yellow', fontSize: '15px' }} />
            )}
            <img src={nft.previews.find(p => p.resolution === '100x100')?.url || ''} alt="NFT Preview" style={{ width: '30px', height: '30px' }} />
          </div>
        );
      })}
    </div>
  );

  const renderScamTransactions = () => {
    const scamEvents = transactionData.filter(event => event.is_scam);

    return scamEvents.map((event, index) => {
      const action = event.actions[0];
      const { value, value_image } = action.simple_preview || {};
      const timestamp = new Date(event.timestamp * 1000).toLocaleString();

      return (
        <p key={event.event_id}>
          {index + 1}. You received <strong>{value}</strong>
          {value_image && (
            <> <img src={value_image} alt="Transaction Value" style={{ width: "15px", height: "15px", verticalAlign: "middle" }} /></>
          )}
          {" "}on {timestamp}.{" "}
          <FaExclamationTriangle style={{ color: 'orange', marginLeft: '5px', verticalAlign: 'middle' }} />
        </p>
      );
    });
  };

  return (
    <div>
      <h4>Jetton Stats</h4>
      <div style={{ fontSize: '0.6rem' }}>
        <p>Tokens with 0 balance: {zeroBalanceTokens.length}</p>
        {renderTokens(zeroBalanceTokens)}
      </div>
      <div style={{ fontSize: '0.6rem' }}>
        <p>Tokens with balance > 0: {nonZeroBalanceTokens.length}</p>
        {renderTokens(nonZeroBalanceTokens)}
      </div>
      <div style={{ fontSize: '0.6rem' }}>
        <p>Scam Tokens: {scamTokens.length}</p>
        {renderTokens(scamTokens)}
      </div>
      <h4>NFT Stats</h4>
      <div style={{ fontSize: '0.6rem' }}>
        <p>Total NFTs: {nftData.length}</p>
        {renderNFTs([...goodNFTs, ...suspiciousNFTs])}
      </div>
      <h4>Transaction Stats</h4>
      <div style={{ fontSize: '0.6rem' }}>
        <p>Total Transactions: {totalTransactions}</p>
        <p>Scam Transactions: {scamTransactions}</p>
        {renderScamTransactions()}
      </div>
      <p>You made your first TON transaction on {firstDate}.</p>
      <p>Wow, you've been interacting on the TON ecosystem for {durationText}!</p>
      <p>Your favorite wallet is <b>{walletName}</b></p>
    </div>
  );
};

export default JettonStats;
