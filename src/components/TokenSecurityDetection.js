import React, { useState, useEffect } from 'react';
import { useQuery, } from "react-query";
import './TokenSecurityDetection.css'; // Custom CSS for styling
import Dashboard from "../components/Dashboard.js";
import AddressDisplay from "./AddressDisplay.js";
import { FaEthereum, FaUserAlt, FaExclamationTriangle, FaExclamationCircle, FaSkullCrossbones, FaFrown, FaCrown, FaCode, FaCheckCircle, FaTimesCircle, FaCopy, } from 'react-icons/fa'; // Import icons
import NegativeSummary from "./NegativeSummary.js";
import Augmented from "../assets/augmented.png";

const TokenSecurityDetection = () => {
  const [riskyCount, setRiskyCount] = useState(0);
  const [attentionCount, setAttentionCount] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
  const [tokenAddress, setTokenAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Checking token.');
  const [errorMessage, setErrorMessage] = useState(''); // For the yellow error message
  const [hasRequested, setHasRequested] = useState(false);

  const networkChainMap = {
    SUI: '204',
    TON: '201022',
    Base: '8453',
    Solana: '0',
    Ethereum: '1',
    Arbitrum: '42161',
    BSC: '56',
  };

  useEffect(() => {
    let interval;
    if (loading) {
      let dotCount = 1;
      interval = setInterval(() => {
        setLoadingMessage(`Checking token${'.'.repeat(dotCount)}`);
        dotCount = dotCount === 5 ? 1 : dotCount + 1;
      }, 500);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleNetworkChange = (event) => {
    const newNetwork = event.target.value;
    console.log('Network changed to:', newNetwork);  // Log network change
    setSelectedNetwork(newNetwork);

    // Clear result and error message when network changes
    setResult(null);
    setErrorMessage('');
    setHasRequested(false); // Reset the request flag

    // Replace the token address with the corresponding message if SUI or TON is selected
    if (newNetwork === 'SUI') {
      setTokenAddress('SUI Network will be added in the future');
    } else if (newNetwork === 'TON') {
      setTokenAddress('TON Network will be added in the future');
    } else {
      setTokenAddress(''); // Clear input when other networks are selected
    }
  };

  const handleTokenAddressChange = (event) => {
    console.log('Token address changed to:', event.target.value);
    setTokenAddress(event.target.value);

    // Clear result and error message when address changes
    setResult(null);
    setErrorMessage('');
    setHasRequested(false); // Reset the request flag
  };

  // Fetch data using React Query
  const chainId = networkChainMap[selectedNetwork];
  const apiUrl = chainId === '0' 
    ? `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${tokenAddress}` 
    : `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`;

  const { data, isLoading, isError, refetch } = useQuery(
    ["tokenSecurity", chainId, tokenAddress],
    async () => {
      if (!tokenAddress) throw new Error("Token address is required.");
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data.");
      return response.json();
    },
    {
      //enabled: !!tokenAddress && !["SUI", "TON"].includes(selectedNetwork), // Fetch only when a valid address is provided
      enabled: false, // Disable automatic fetching
      onSuccess: (data) => {
        setResult(data.result);
        setLoading(false); // Hide loading message when data is successfully fetched
        setHasRequested(true); // Set the flag to true once the check is done
      },
      onError: (error) => {
        setErrorMessage("Data fetch unsuccessful, please check the contract address");
        setResult(null); // Optionally clear the result on error
        setLoading(false); // Hide loading message on error
        setHasRequested(true); // Set the flag to true once the check is done
      },            
    }
  );


  useEffect(() => {
    if (data && data.result) {
      const riskyFieldsToCheck = [
        "personal_slippage_modifiable",
        "is_whitelisted",
        "is_blacklisted",
        "slippage_modifiable",
        "trading_cooldown",
        "cannot_buy",
        "cannot_sell_all",
        "is_honeypot",
        "transfer_pausable",
        "owner_change_balance",
        "selfdestruct",
      ];

      const attentionFieldsToCheck = [
        "gas_abuse",
        "external_call",
        "hidden_owner",
        "can_take_back_ownership",
        "is_proxy",
        "is_mintable",
        "is_anti_whale",
        "anti_whale_modifiable",
      ];

      let riskyCount = 0;
      let attentionCount = 0;
      const resultKeys = Object.keys(data.result);

      if (resultKeys.length > 0) {
        const resultData = data.result[resultKeys[0]];

        // Count risky items
        riskyCount = riskyFieldsToCheck.reduce(
          (count, field) => count + (resultData[field] === "1" ? 1 : 0),
          0
        );

        // Count attention items
        attentionCount = attentionFieldsToCheck.reduce(
          (count, field) => count + (resultData[field] === "1" ? 1 : 0),
          0
        );

        if (resultData.is_open_source === "0") attentionCount++;
      }

      setRiskyCount(riskyCount);
      setAttentionCount(attentionCount);
    }
  }, [data]);

  const isInvalidResult = (result) => {
    if (!result || Object.keys(result).length === 0) return true;

    const resultData = result[Object.keys(result)[0]];

    // Check if creator_address is invalid (case insensitive, null, undefined, 0, N/A, or NA)
    const creatorAddress = resultData?.creator_address?.toString().toLowerCase();
    if (
      creatorAddress === 'n/a' || 
      creatorAddress === '0' || 
      creatorAddress === 'na' || 
      creatorAddress === 'null' || 
      creatorAddress === 'undefined' || 
      !creatorAddress // also checks for null, undefined, empty string
    ) {
      return true;
    }

    return false;
  };


  const isNetworkDisabled = selectedNetwork === "SUI" || selectedNetwork === "TON";
  const placeholderMessage =
    selectedNetwork === "SUI"
      ? "SUI Not Available Now"
      : selectedNetwork === "TON"
      ? "TON Not Available Now"
      : "Enter Token Address";
  const checker = (result, field) => {
    if (!result || !Object.keys(result)[0]) {
      return <span style={{ marginLeft: '5px' }}>N/A</span>;
    }

    const value = result[Object.keys(result)[0]][field];
    if (field === 'cannot_buy') {
      return (
        <span style={{ marginLeft: '5px', display: 'inline-flex', alignItems: 'center' }}>
          {value === "0" ? <>Yes &nbsp; <FaCheckCircle color="green" /></> : <>No &nbsp; <FaTimesCircle color="red" /></>}
        </span>
      );
    }
    if (field === 'is_open_source') {
      return (
        <span style={{ marginLeft: '5px', display: 'inline-flex', alignItems: 'center' }}>
          {value === "1" ? <>Yes &nbsp; <FaCheckCircle color="green" /></> : <>No &nbsp; <FaTimesCircle color="orange" /></>}
        </span>
      );
    }
    if (field === 'owner_change_balance') {
      return (
        <span style={{ marginLeft: '5px', display: 'inline-flex', alignItems: 'center' }}>
          {value === "0" ? <>No &nbsp; <FaCheckCircle color="green" /></> : <>Yes &nbsp; <FaTimesCircle color="red" /></>}
        </span>
      );
    }
    if (field === 'transfer_pausable' || field === 'is_honeypot' || field === 'cannot_sell_all' || field === 'trading_cooldown' || field === 'is_anti_whale' || field === 'anti_whale_modifiable' || field === 'slippage_modifiable' || field === 'is_blacklisted' || field === 'is_whitelisted' || field === 'personal_slippage_modifiable') {
      return (
        <span style={{ marginLeft: '5px', display: 'inline-flex', alignItems: 'center' }}>
          {value === "1" ? <>Yes &nbsp; <FaTimesCircle color="red" /></> : <>No &nbsp; <FaCheckCircle color="green" /></>}
        </span>
      );
    }
    if (field === 'external_call' || field === 'selfdestruct' || field === 'hidden_owner' || field === 'can_take_back_ownership' || field === 'is_proxy' || field === 'is_mintable') {
      return (
        <span style={{ marginLeft: '5px', display: 'inline-flex', alignItems: 'center' }}>
          {value === "1" ? <>Yes &nbsp; <FaTimesCircle color="orange" /></> : <>No &nbsp; <FaCheckCircle color="green" /></>}
        </span>
      );
    }

    return (
      <span style={{ marginLeft: '5px' }}>
        {value === "1" ? "Yes" : value === "0" ? "No" : value || 'N/A'}
      </span>
    );
  };




  const displayFieldValue = (result, field) => {
    return result && Object.keys(result)[0] ? (
      <span style={{ marginLeft: '0px' }}>
        {result[Object.keys(result)[0]][field] || 'N/A'}
      </span>
    ) : (
      <span style={{ marginLeft: '5px' }}>N/A</span>
    );
  };

  function formatNumber(value) {
      const number = Number(value);
      if (isNaN(number)) return "N/A";

      if (number >= 1e27) return (number / 1e27).toFixed(1) + "D"; // Decillion
      if (number >= 1e24) return (number / 1e24).toFixed(1) + "N"; // Nonillion
      if (number >= 1e21) return (number / 1e21).toFixed(1) + "O"; // Octillion
      if (number >= 1e18) return (number / 1e18).toFixed(1) + "S"; // Septillion
      if (number >= 1e15) return (number / 1e15).toFixed(1) + "Q"; // Quadrillion
      if (number >= 1e12) return (number / 1e12).toFixed(1) + "T"; // Trillion
      if (number >= 1e9) return (number / 1e9).toFixed(1) + "B"; // Billion
      if (number >= 1e6) return (number / 1e6).toFixed(1) + "M";   // Million
      if (number >= 1e3) return (number / 1e3).toFixed(1) + "K";   // Thousand
      return number.toFixed(1); // Default formatting
  }



  return (
    <div className="token-security-container font-inter  bg-black mt-4">

      <div className="flex items-center justify-center mb-2">
        <h1 style={{ fontSize: '1rem', fontWeight: 'bold', marginLeft: '5px' }}>Digital Asset Risk Assessment</h1>
      </div>

      <div className="font-inter">  
        <p style={{ fontSize: '0.8rem', color: '#f7f9fb' }}>Beat scammers in their own game. See beyond coin owners' claims.</p>

        <div className="form-container font-inter">
          <select value={selectedNetwork} onChange={handleNetworkChange} className="network-select" style={{ fontSize: '0.7rem' }}>
            <option value="Solana">Solana</option>
            <option value="Base">Base</option>
            <option value="Arbitrum">Arbitrum</option>
            <option value="BSC">BSC</option>
            <option value="Ethereum">Ethereum</option>
            <option value="SUI">SUI</option>
            <option value="TON">TON</option>
          </select>
          <input
            type="text"
            value={tokenAddress}
            onChange={handleTokenAddressChange}
            placeholder={placeholderMessage}
            className="token-input"
            disabled={isNetworkDisabled}
            style={{ fontSize: '0.8rem', color: '#f7f9fb' }}
          />
          <button
            onClick={() => {
              if (tokenAddress && !["SUI", "TON"].includes(selectedNetwork)) {
                setLoading(true);
                setLoadingMessage("Checking token...");
                refetch();
                setHasRequested(true); // Set the flag to true once the check is done
              }
            }}
            className="check-button"
            disabled={isNetworkDisabled || !tokenAddress || ["SUI", "TON"].includes(selectedNetwork)}
          >
            Check
          </button>
        </div>

        {errorMessage && <p className="error-message" style={{ color: 'yellow' }}>{errorMessage}</p>}

        {loading && <p className="loading-message">{loadingMessage}</p>}

        {!loading && hasRequested && (
          <>
            {result && Object.keys(result).length === 0 ? (
              <p className="text-xs text-[#dbe2eb]" style={{ color: 'yellow', fontSize: '12px' }}>
                Invalid data. Make sure to select the right network for the contract address.
              </p>
            ) : !result || isInvalidResult(result) ? (
              <p className="text-xs text-[#dbe2eb]" style={{ color: 'yellow', fontSize: '12px' }}>
                No token data available. Did you use the correct contract address?
              </p>
            ) : null}
          </>
        )}

        {!loading && hasRequested && !isInvalidResult(result) && result && Object.keys(result).length > 0 && (
          <>
            <div className="result-container">
              <h2>Scan Result:</h2>
            </div>

            <div className="flex justify-between p-4 rounded-lg shadow-lg space-x-4">
              <div className="flex items-center w-1/3 space-x-1 text-center">
                <FaSkullCrossbones style={{ color: 'red' }} className="icon w-4 h-4 text-sm" />
                <div>
                  <span className="text-sm">Threat:</span>
                  <span className="font-semibold ml-1">{riskyCount}</span>
                </div>
              </div>
              <div className="flex items-center w-1/3 space-x-1 text-center">
                <FaExclamationTriangle style={{ color: '#FFA500' }} className="icon w-4 h-4 text-sm" />
                <div>
                  <span className="text-sm">Caution:</span>
                  <span className="font-semibold ml-1">{attentionCount}</span>
                </div>
              </div>
              <div className="flex items-center w-1/3 space-x-1 text-center">
                <FaFrown style={{ color: 'purple' }} className="icon w-4 h-4 text-sm" />
                <div>
                  <span className="text-sm">Scams:</span>
                  <span className="font-semibold ml-1">{displayFieldValue(result, 'honeypot_with_same_creator')}</span>
                </div>
              </div>
            </div>

            <NegativeSummary tokenData={result && result[Object.keys(result)[0]]} />

            <div className="detection-summary" style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
              <div className="creator-owner-info" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center', justifyContent: 'center' }}>
                <div className="creator-info" style={{ display: 'flex', alignItems: 'center', flex: '1 1 45%', minWidth: '200px', justifyContent: 'center' }}>
                  <FaCode className="icon" />
                  <span style={{ marginLeft: '1px' }}>Creator:</span>
                  <span style={{ marginLeft: '8px', fontSize: '0.8rem' }}>
                    <AddressDisplay address={result?.[Object.keys(result)?.[0]]?.creator_address || "N/A"} />
                  </span>
                </div>

                <div className="creator-info" style={{ display: 'flex', alignItems: 'center', flex: '1 1 45%', minWidth: '200px', justifyContent: 'center', marginTop: '20px' }}>
                  <FaCrown className="icon" />
                  <span style={{ marginLeft: '1px' }}>Owner:</span>
                  <span style={{ marginLeft: '8px', fontSize: '0.8rem' }}>
                    <AddressDisplay address={result?.[Object.keys(result)?.[0]]?.owner_address || "N/A"} />
                  </span>
                </div>
              </div>
            </div>

            {result && Object.keys(result).length > 0 && <Dashboard tokenData={result[Object.keys(result)[0]]} />}
          </>
        )}  

        <p className="note">
          <span style={{ fontWeight: 'bold', color: '#f7f9fb' }}>Note</span>: <span style={{ fontSize: '0.6rem', color: '#f7f9fb' }}> The advanced AI helps spot potential scam tokens, but remember, no system grants 100% safety. Stay vigilant and do your own research!</span>
        </p>
      </div>
    </div>
  );
};

export default TokenSecurityDetection;