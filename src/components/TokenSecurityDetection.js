import React, { useState, useEffect } from 'react';
import './TokenSecurityDetection.css'; // Custom CSS for styling
import Dashboard from "../components/Dashboard.js";
import { FaEthereum, FaUserAlt, FaExclamationTriangle, FaSkullCrossbones, FaFrown, FaCrown, FaCode, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import icons

const TokenSecurityDetection = () => {
  const [riskyCount, setRiskyCount] = useState(0);
  const [attentionCount, setAttentionCount] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState('Solana');
  const [tokenAddress, setTokenAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Checking token.');
  const [errorMessage, setErrorMessage] = useState(''); // For the yellow error message

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
    setSelectedNetwork(newNetwork);

    // Clear result and error message when network changes
    setResult(null);
    setErrorMessage('');

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
    setTokenAddress(event.target.value);

    // Clear result and error message when address changes
    setResult(null);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!tokenAddress || tokenAddress === 'SUI Network will be added in the future' || tokenAddress === 'TON Network will be added in the future') {
      setErrorMessage('Please enter a token address.');
      return;
    }

    const chainId = networkChainMap[selectedNetwork];

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/token-security`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chainId, addresses: [tokenAddress] }),
      });

      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        setResult(`Error: ${data.error}`);
      } else {
        setResult(data.result);

        // List of specific fields for risky items
        const riskyFieldsToCheck = [
          "personal_slippage_modifiable",
          "is_whitelisted",
          "is_blacklisted",
          "slippage_modifiable",
          "anti_whale_modifiable",
          "is_anti_whale",
          "trading_cooldown",
          "cannot_buy",
          "cannot_sell_all",
          "is_honeypot",
          "transfer_pausable",
          "owner_change_balance",
        ];

        // List of specific fields for attention items
        const attentionFieldsToCheck = [
          "gas_abuse",
          "external_call",
          "selfdestruct",
          "hidden_owner",
          "can_take_back_ownership",
          "is_proxy",
          "is_mintable",
        ];

        // Count fields with a value of "1" for risky items
        let riskyCount = 0;
        const resultKeys = Object.keys(data.result);
        
        if (resultKeys.length > 0) {
          const resultData = data.result[resultKeys[0]]; // Access the first address's data

          // Check for risky fields
          for (const field of riskyFieldsToCheck) {
            if (resultData[field] === "1") {
              riskyCount++;
            }
          }

          // Update state for riskyCount to display in UI
          setRiskyCount(riskyCount);

          // Count attention items
          let attentionCount = 0;

          // Check for attention fields
          for (const field of attentionFieldsToCheck) {
            if (resultData[field] === "1") {
              attentionCount++;
            }
          }

          // Check if is_open_source is "0"
          if (resultData.is_open_source === "0") {
            attentionCount++;
          }

          // Update state for attentionCount to display in UI
          setAttentionCount(attentionCount);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResult(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isNetworkDisabled = selectedNetwork === 'SUI' || selectedNetwork === 'TON';
  const placeholderMessage = selectedNetwork === 'SUI'
    ? 'SUI Network will be added in the future'
    : selectedNetwork === 'TON'
    ? 'TON Network will be added in the future'
    : 'Enter Token Address';
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



  return (
    <div className="token-security-container">
      <h1>Token Security Detection</h1>
      <p>Open, permissionless, user-driven token security detection platform</p>

      <div className="form-container">
        <select value={selectedNetwork} onChange={handleNetworkChange} className="network-select">
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
        />
        <button onClick={handleSubmit} className="check-button" disabled={isNetworkDisabled}>Check</button>
      </div>

      {errorMessage && <p className="error-message" style={{ color: 'yellow' }}>{errorMessage}</p>}

            {loading && <p className="loading-message">{loadingMessage}</p>}
      {result && (
        <>
          <div className="result-container">
            <h2>Result:</h2>
            {/* Raw JSON data (optional for debugging) */}
            {/*<pre>{JSON.stringify(result, null, 2)}</pre>*/}
          </div>

          {/* Coin Info Section */}
          <div className="coin-info">
            <div className="coin-info-item">
              <FaUserAlt className="icon" />
              <span>Name:</span>
              {displayFieldValue(result, 'token_name')}
            </div>
            <div className="coin-info-item">
              <FaEthereum className="icon" />
              <span>Symbol:</span>
              {displayFieldValue(result, 'token_symbol')}
            </div>
            <div className="coin-info-item">
              <FaSkullCrossbones className="icon" />
              <span>Risky item:</span>
              <span>{riskyCount}</span>
            </div>
            <div className="coin-info-item">
              <FaExclamationTriangle className="icon" />
              <span>Attention item:</span>
              <span>{attentionCount}</span>
            </div>
            <div className="coin-info-item">
              <FaFrown className="icon" />
              <span>Scam Coin Created:</span>
              {displayFieldValue(result, 'honeypot_with_same_creator')}
            </div>
          </div>

          {/* Detection Summary Section */}
          <div className="detection-summary" style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
            {/* Creator and Owner Information */}
            <div className="creator-owner-info" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '5px', /* Reduced the gap between the items */
              alignItems: 'center', 
              justifyContent: 'center'  /* Centering the content */
            }}>
              {/* Creator Info */}
              <div className="creator-info" style={{ display: 'flex', alignItems: 'center', flex: '1 1 45%', minWidth: '200px', justifyContent: 'center' }}>
                <FaCode className="icon" />
                <span style={{ marginLeft: '5px' }}>Creator:</span>
                {checker(result, 'creator_address')}
              </div>

              {/* Owner Info */}
              <div className="owner-info" style={{ display: 'flex', alignItems: 'center', flex: '1 1 45%', minWidth: '200px', justifyContent: 'center' }}>
                <FaCrown className="icon" />
                <span style={{ marginLeft: '5px' }}>Owner:</span>
                {checker(result, 'owner_address')}
              </div>
            </div>
          </div>
          {/* Security Checks */}
          <div className="security-checks" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="security-section" style={{ border: '1px solid black', padding: '10px', margin: '10px 2px 10px 10px' }}>
              <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', textAlign: 'left', fontSize: '10px', fontFamily: '"Roboto Mono", monospace' }}>
                <li>Is Contract source code verified?{checker(result, 'is_open_source')}</li>
                <li>Any Proxy code in the contract?{checker(result, 'is_proxy')}</li>
                <li>Can team mint more tokens?{checker(result, 'is_mintable')}</li>
                <li>Can the team reclaim ownership after renouncing?{checker(result, 'can_take_back_ownership')}</li>
                <li>Can the project owner alter coin balance?{checker(result, 'owner_change_balance')}</li>
                <li>Is there a hidden owner in the project?{checker(result, 'hidden_owner')}</li>
                <li>Can this token destroy itself?{checker(result, 'selfdestruct')}</li>
                <li>Did the project invoke any external function?{checker(result, 'external_call')}</li>
                <li>Is the project using people's gas fee to mint other coins?{checker(result, 'gas_abuse')}</li>
                <li>Can the team pause transfer at some point?{checker(result, 'transfer_pausable')}</li>
              </ol>
            </div>
            <div className="security-section" style={{ border: '1px solid black', padding: '10px', margin: '10px 10px 10px 2px' }}>
              <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', textAlign: 'left', fontSize: '10px', fontFamily: '"Roboto Mono", monospace' }} start={11}>
                <li>Is this token a Trap or HoneyPot?{checker(result, 'is_honeypot')}</li>
                <li>Are holders permitted to sell all their coins?{checker(result, 'cannot_sell_all')}</li>
                <li>Can anyone else buy the token?{checker(result, 'cannot_buy')}</li>
                <li>Is a trading cooldown feature present?{checker(result, 'trading_cooldown')}</li>
                <li>Are there any anti-whale mechanisms found?{checker(result, 'is_anti_whale')}</li>
                <li>Can the anti-whale functionality be altered?{checker(result, 'anti_whale_modifiable')}</li>
                <li>Is it possible to modify the tax feature?{checker(result, 'slippage_modifiable')}</li>
                <li>Any blacklist mechanism been identified? {checker(result, 'is_blacklisted')}</li>
                <li>Is there a feature for whitelisting?{checker(result, 'is_whitelisted')}</li>
                <li>Can the team alter the tax for a particular wallet address?{checker(result, 'personal_slippage_modifiable')}</li>
              </ol>
            </div>
          </div>
        </>
      )}

      {/* The dashboard of the token details */}

      <Dashboard tokenData={result && result[Object.keys(result)[0]]} />

      <p className="note">
        Note: We can help you determine if a smart contract may be a scam, but there is no 100% guarantee.
      </p>
    </div>
  );
};

export default TokenSecurityDetection;
