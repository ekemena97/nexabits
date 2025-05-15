import React, { useState, useEffect } from "react";
import { useQuery } from "react-query"; // React Query hook
import "./TokenSecurityDetection.css"; // Custom CSS for styling
import Dashboard from "../components/Dashboard.js";
import AddressDisplay from "./AddressDisplay.js";
import {
  FaEthereum,
  FaUserAlt,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaSkullCrossbones,
  FaFrown,
  FaCrown,
  FaCode,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
} from "react-icons/fa";
import NegativeSummary from "./NegativeSummary.js";

const TokenSecurityDetection = () => {
  const [riskyCount, setRiskyCount] = useState(0);
  const [attentionCount, setAttentionCount] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState("Solana");
  const [tokenAddress, setTokenAddress] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Checking token...");
  const [errorMessage, setErrorMessage] = useState(""); // For the yellow error message

  const networkChainMap = {
    SUI: "204",
    TON: "201022",
    Base: "8453",
    Solana: "0",
    Ethereum: "1",
    Arbitrum: "42161",
    BSC: "56",
  };

  useEffect(() => {
    let interval;
    if (loadingMessage) {
      let dotCount = 1;
      interval = setInterval(() => {
        setLoadingMessage(`Checking token${'.'.repeat(dotCount)}`);
        dotCount = dotCount === 5 ? 1 : dotCount + 1;
      }, 500);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loadingMessage]);

  const handleNetworkChange = (event) => {
    const newNetwork = event.target.value;
    setSelectedNetwork(newNetwork);
    setTokenAddress(""); // Reset token address when network changes
    setErrorMessage(""); // Reset error message
  };

  const handleTokenAddressChange = (event) => {
    setTokenAddress(event.target.value);
    setErrorMessage(""); // Clear error message when user types a new address
  };

  // Fetch data using React Query
  const chainId = networkChainMap[selectedNetwork];
  const apiUrl = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`;
  
  const { data, isLoading, isError } = useQuery(
    ["tokenSecurity", chainId, tokenAddress],
    async () => {
      if (!tokenAddress) throw new Error("Token address is required.");
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data.");
      return response.json();
    },
    {
      enabled: !!tokenAddress && !["SUI", "TON"].includes(selectedNetwork), // Fetch only when a valid address is provided
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

  const isNetworkDisabled = selectedNetwork === "SUI" || selectedNetwork === "TON";
  const placeholderMessage =
    selectedNetwork === "SUI"
      ? "SUI Not Available Now"
      : selectedNetwork === "TON"
      ? "TON Not Available Now"
      : "Enter Token Address";

  return (
    <div className="token-security-container font-inter">
      <h1 style={{ fontSize: "1rem", fontWeight: "bold" }}>
        Digital Asset Risk Assessment
      </h1>
      <p style={{ fontSize: "0.8rem" }}>
        Beat scammers in their own game. See beyond coin owners' claims.
      </p>

      <div className="form-container">
        <select
          value={selectedNetwork}
          onChange={handleNetworkChange}
          className="network-select"
          style={{ fontSize: "0.7rem" }}
        >
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
          style={{ fontSize: "0.8rem", color: "#f7f9fb" }}
        />
        <button
          onClick={() => {}}
          className="check-button"
          disabled={isNetworkDisabled || !tokenAddress}
        >
          Check
        </button>
      </div>

      {isLoading && <p className="loading-message">{loadingMessage}</p>}
      {isError && <p className="error-message">Error fetching data.</p>}
      {data && <div>{/* Render the result here */}</div>}
    </div>
  );
};

export default TokenSecurityDetection;
